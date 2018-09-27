"use strict";
/**
 * This file is part of the vscode-kanban distribution.
 * Copyright (c) Marcel Joachim Kloubert.
 *
 * vscode-kanban is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * vscode-kanban is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const FSExtra = require("fs-extra");
const OS = require("os");
const Path = require("path");
const vsckb = require("./extension");
const vscode = require("vscode");
const vscode_helpers = require("vscode-helpers");
/**
 * Starts / stops time tracking via Toggl.
 *
 * @param {vscode_workspaces.TrackTimeEventArguments} args The event arguments.
 * @param {TimeTrackingByToggleSettings} settings The settings.
 */
function trackTime(args, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        const ME = this;
        let token = vscode_helpers.toStringSafe(settings.token);
        let existingTokenFile = false;
        if (!vscode_helpers.isEmptyString(token)) {
            try {
                let tokenFilePath = token;
                if (!Path.isAbsolute(tokenFilePath)) {
                    tokenFilePath = Path.join(OS.homedir(), tokenFilePath);
                }
                tokenFilePath = Path.resolve(tokenFilePath);
                if (yield vscode_helpers.isFile(tokenFilePath, false)) {
                    existingTokenFile = tokenFilePath;
                }
            }
            catch (_a) { }
        }
        if (false !== existingTokenFile) {
            token = yield FSExtra.readFile(existingTokenFile, 'utf8');
        }
        token = token.trim();
        if ('' === token) {
            throw new Error('No API token defined!');
        }
        const CREATE_AUTH = () => {
            return `Basic ${new Buffer(token + ':api_token', 'ascii').toString('base64')}`;
        };
        const THROW_HTTP_ERROR = (result, msg) => {
            throw new Error(vscode_helpers.format("{0}: [{1}] '{2}'", msg, result.code, result.status));
        };
        let projects = [];
        const PROJECT_ID = parseInt(vscode_helpers.toStringSafe(settings.project).trim());
        if (!isNaN(PROJECT_ID)) {
            const RESULT = yield vscode_helpers.GET(`https://www.toggl.com/api/v8/projects/${PROJECT_ID}`, {
                'Authorization': CREATE_AUTH(),
            });
            if (200 === RESULT.code) {
                const PROJECT_DATA = JSON.parse((yield RESULT.readBody()).toString('utf8'));
                if (PROJECT_DATA && !_.isNil(PROJECT_DATA.data)) {
                    projects.push(PROJECT_DATA.data);
                }
            }
            else if (404 === RESULT.code) {
                vscode.window.showWarningMessage(`Project '${PROJECT_ID}' not found!`);
                return;
            }
        }
        if (projects.length < 1) {
            yield vscode.window.withProgress({
                cancellable: false,
                location: vscode.ProgressLocation.Notification,
                title: 'Loading Toggl workspaces ...',
            }, (progress) => __awaiter(this, void 0, void 0, function* () {
                let workspaces;
                {
                    const RESULT = yield vscode_helpers.GET('https://www.toggl.com/api/v8/workspaces', {
                        'Authorization': CREATE_AUTH(),
                    });
                    if (200 !== RESULT.code) {
                        THROW_HTTP_ERROR(RESULT, 'Could not load Toggle workspaces');
                    }
                    workspaces = vscode_helpers.asArray(JSON.parse((yield RESULT.readBody()).toString('utf8')));
                }
                for (let i = 0; i < workspaces.length; i++) {
                    const WS = workspaces[i];
                    progress.report({
                        message: `Loading Toggl projects of workspace '${vscode_helpers.toStringSafe(WS.name).trim()}' (${i + 1} / ${workspaces.length}) ...`,
                    });
                    const RESULT = yield vscode_helpers.GET(`https://www.toggl.com/api/v8/workspaces/${WS.id}/projects`, {
                        'Authorization': CREATE_AUTH(),
                    });
                    if (200 !== RESULT.code) {
                        THROW_HTTP_ERROR(RESULT, `Could not load Toggle projects of workspace '${vscode_helpers.toStringSafe(WS.name)}' (${WS.id})`);
                    }
                    const WORKSPACE_PROJECTS = vscode_helpers.asArray(JSON.parse((yield RESULT.readBody()).toString('utf8')));
                    WORKSPACE_PROJECTS.forEach(p => {
                        p.__vsckbWorkspace = WS;
                    });
                    projects = projects.concat(WORKSPACE_PROJECTS);
                }
            }));
        }
        const QUICK_PICKS = projects.map(p => {
            return {
                action: () => __awaiter(this, void 0, void 0, function* () {
                    const RESULT = yield vscode_helpers.GET('https://www.toggl.com/api/v8/time_entries/current', {
                        'Authorization': CREATE_AUTH(),
                    });
                    let timeEntry;
                    if (200 === RESULT.code) {
                        const CURRENT_ENTRY = JSON.parse((yield RESULT.readBody()).toString('utf8'));
                        if (CURRENT_ENTRY) {
                            timeEntry = CURRENT_ENTRY.data;
                        }
                    }
                    else {
                        THROW_HTTP_ERROR(RESULT, `Could not load current Toggle time entry for project '${vscode_helpers.toStringSafe(p.name)}'`);
                    }
                    if (!_.isNil(timeEntry)) {
                        if (timeEntry.pid !== p.id) {
                            vscode.window.showWarningMessage(`The current time entry does not belong to the project '${vscode_helpers.toStringSafe(p.name)}'. You have to stop it first, before you can continue.`);
                            return;
                        }
                    }
                    if (_.isNil(timeEntry)) {
                        // start
                        const TAGS = ['vscode'];
                        TAGS.push(ME.folder.name);
                        TAGS.push(Path.basename(ME.folder.name));
                        TAGS.push(args.data.column);
                        const RESULT = yield vscode_helpers.POST('https://www.toggl.com/api/v8/time_entries/start', JSON.stringify({
                            'time_entry': {
                                'description': vscode_helpers.toStringSafe(args.data.card.title).trim(),
                                'tags': vscode_helpers.from(TAGS).select(x => {
                                    return vscode_helpers.normalizeString(x);
                                }).where(x => '' !== x)
                                    .distinct()
                                    .order()
                                    .toArray(),
                                'pid': p.id,
                                'created_with': 'vscode-kanban',
                            }
                        }), {
                            'Authorization': CREATE_AUTH(),
                        });
                        if (200 === RESULT.code) {
                            vscode.window.showInformationMessage('Time tracking has been started.');
                        }
                        else {
                            THROW_HTTP_ERROR(RESULT, 'CREATING new Toggle time entry failed');
                        }
                    }
                    else {
                        // stop
                        const RESULT = yield vscode_helpers.PUT(`https://www.toggl.com/api/v8/time_entries/${timeEntry.id}/stop`, null, {
                            'Authorization': CREATE_AUTH(),
                        });
                        if (200 === RESULT.code) {
                            vscode.window.showInformationMessage('Time tracking has been STOPPED.', {
                                action: () => __awaiter(this, void 0, void 0, function* () {
                                    yield vsckb.open('https://www.toggl.com/app/timer');
                                }),
                                title: 'Open Toggl ...',
                                isCloseAffordance: false,
                            }).then((selectedItem) => {
                                (() => __awaiter(this, void 0, void 0, function* () {
                                    if (selectedItem) {
                                        yield selectedItem.action();
                                    }
                                }))().then(() => { }, (err) => {
                                    vsckb.showError(err);
                                });
                            }, (err) => {
                                vsckb.showError(err);
                            });
                        }
                        else {
                            THROW_HTTP_ERROR(RESULT, 'STOPPING current Toggle time entry failed');
                        }
                    }
                }),
                detail: _.isNil(p.__vsckbWorkspace) ? undefined
                    : vscode_helpers.toStringSafe(p.__vsckbWorkspace.name).trim(),
                label: vscode_helpers.toStringSafe(p.name).trim(),
                __vsckbProject: p,
            };
        }).sort((x, y) => {
            // first by project name
            const COMP_0 = vscode_helpers.compareValuesBy(x, y, qp => {
                return vscode_helpers.normalizeString(qp.label);
            });
            if (0 !== COMP_0) {
                return COMP_0;
            }
            // then by workspace
            return vscode_helpers.compareValuesBy(x, y, qp => {
                return vscode_helpers.normalizeString(qp.detail);
            });
        });
        if (QUICK_PICKS.length < 1) {
            vscode.window.showWarningMessage('No Toggl project found!');
            return;
        }
        let selectedItem;
        if (1 === QUICK_PICKS.length) {
            selectedItem = QUICK_PICKS[0];
        }
        else {
            selectedItem = yield vscode.window.showQuickPick(QUICK_PICKS, {
                canPickMany: false,
                placeHolder: 'Select Toggl project ...',
            });
        }
        if (selectedItem) {
            yield selectedItem.action();
        }
    });
}
exports.trackTime = trackTime;
//# sourceMappingURL=toggl.js.map