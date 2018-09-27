'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const _ = require("lodash");
const ChildProcess = require("child_process");
const FSExtra = require("fs-extra");
const Marked = require("marked");
const Moment = require("moment");
const OS = require("os");
const Path = require("path");
const vsckb_workspaces = require("./workspaces");
const vscode = require("vscode");
const vscode_helpers = require("vscode-helpers");
/**
 * The name of the extension's directory inside the user's home directory.
 */
exports.EXTENSION_DIR = '.vscode-kanban';
let isDeactivating = false;
const KEY_LAST_KNOWN_VERSION = 'vsckbLastKnownVersion';
let logger;
let packageFile;
let workspaceWatcher;
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const WF = vscode_helpers.buildWorkflow();
        // logger
        WF.next(() => {
            logger = vscode_helpers.createLogger((ctx) => {
                const EXT_DIR = getExtensionDir();
                if (!vscode_helpers.isDirectorySync(EXT_DIR)) {
                    return;
                }
                const LOGS_DIR = Path.join(EXT_DIR, '.logs');
                if (!FSExtra.existsSync(LOGS_DIR)) {
                    FSExtra.mkdirsSync(LOGS_DIR);
                }
                if (!vscode_helpers.isDirectorySync(LOGS_DIR)) {
                    return;
                }
                let logType = ctx.type;
                if (_.isNil(logType)) {
                    logType = vscode_helpers.LogType.Debug;
                }
                let time = ctx.time;
                if (!Moment.isMoment(time)) {
                    time = Moment.utc();
                }
                time = vscode_helpers.asUTC(time);
                let msg = `${vscode_helpers.LogType[logType].toUpperCase().trim()}`;
                const TAG = vscode_helpers.normalizeString(_.replace(vscode_helpers.normalizeString(ctx.tag), /\s/ig, '_'));
                if ('' !== TAG) {
                    msg += ' ' + TAG;
                }
                let logMsg;
                if (ctx.message instanceof Error) {
                    logMsg = `${vscode_helpers.isEmptyString(ctx.message.name) ? '' : `(${vscode_helpers.toStringSafe(ctx.message.name).trim()}) `}${vscode_helpers.toStringSafe(ctx.message.message)}`;
                }
                else {
                    logMsg = vscode_helpers.toStringSafe(ctx.message);
                }
                if (vscode_helpers.LogType.Trace === ctx.type) {
                    const STACK = vscode_helpers.toStringSafe((new Error()).stack).split("\n").filter(l => {
                        return l.toLowerCase()
                            .trim()
                            .startsWith('at ');
                    }).join("\n");
                    logMsg += `\n\nStack:\n${STACK}`;
                }
                msg += ` - [${time.format('DD/MMM/YYYY:HH:mm:ss')} +0000] "${_.replace(logMsg, /"/ig, '\\"')}"${OS.EOL}`;
                const LOG_FILE = Path.resolve(Path.join(LOGS_DIR, `${time.format('YYYYMMDD')}.log`));
                FSExtra.appendFileSync(LOG_FILE, msg, 'utf8');
            });
        });
        // extension directory
        WF.next(() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield vscode_helpers.createDirectoryIfNeeded(getExtensionDir());
            }
            catch (e) {
                showError(e);
            }
        }));
        // package file
        WF.next(() => __awaiter(this, void 0, void 0, function* () {
            try {
                const CUR_DIR = __dirname;
                const FILE_PATH = Path.join(CUR_DIR, '../package.json');
                packageFile = JSON.parse(yield FSExtra.readFile(FILE_PATH, 'utf8'));
            }
            catch (_a) { }
        }));
        // commands
        WF.next(() => {
            context.subscriptions.push(
            // openBoard
            vscode.commands.registerCommand('extension.kanban.openBoard', () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const QUICK_PICKS = vsckb_workspaces.getAllWorkspaces().map(ws => {
                        let name = vscode_helpers.toStringSafe(ws.folder.name).trim();
                        if ('' === name) {
                            name = `Workspace #${ws.folder.index}`;
                        }
                        return {
                            action: () => __awaiter(this, void 0, void 0, function* () {
                                yield ws.openBoard();
                            }),
                            detail: ws.folder.uri.fsPath,
                            label: name,
                        };
                    });
                    if (QUICK_PICKS.length < 1) {
                        vscode.window.showWarningMessage('No workspace found!');
                        return;
                    }
                    let selectedItem;
                    if (1 === QUICK_PICKS.length) {
                        selectedItem = QUICK_PICKS[0];
                    }
                    else {
                        selectedItem = yield vscode.window.showQuickPick(QUICK_PICKS, {
                            canPickMany: false,
                            placeHolder: 'Select the workspace of your kanban board ...',
                        });
                    }
                    if (selectedItem) {
                        yield selectedItem.action();
                    }
                }
                catch (e) {
                    showError(e);
                }
            })));
        });
        WF.next(() => __awaiter(this, void 0, void 0, function* () {
            context.subscriptions.push(workspaceWatcher = vscode_helpers.registerWorkspaceWatcher(context, (ev, folder, workspace) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (ev === vscode_helpers.WorkspaceWatcherEvent.Added) {
                        if (folder && folder.uri && (['', 'file'].indexOf(vscode_helpers.normalizeString(folder.uri.scheme)) > -1)) {
                            // only if local URI
                            return yield createNewWorkspace(folder, context);
                        }
                    }
                }
                finally { }
            }), (err, ev, folder, workspace) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    showError(err);
                    return;
                }
                if (ev === vscode_helpers.WorkspaceWatcherEvent.Removed) {
                }
            })));
            yield workspaceWatcher.reload();
            vsckb_workspaces['getAllWorkspaces'] = () => {
                return workspaceWatcher.workspaces
                    .map(ws => ws);
            };
        }));
        // show CHANGELOG
        WF.next(() => __awaiter(this, void 0, void 0, function* () {
            let versionToUpdate = false;
            try {
                if (packageFile) {
                    const VERSION = vscode_helpers.normalizeString(packageFile.version);
                    if ('' !== VERSION) {
                        const LAST_VERSION = vscode_helpers.normalizeString(context.globalState.get(KEY_LAST_KNOWN_VERSION, ''));
                        if (LAST_VERSION !== VERSION) {
                            const CHANGELOG_FILE = Path.resolve(Path.join(__dirname, '../CHANGELOG.md'));
                            if (yield vscode_helpers.isFile(CHANGELOG_FILE)) {
                                const MARKDOWN = yield FSExtra.readFile(CHANGELOG_FILE, 'utf8');
                                let changeLogView;
                                try {
                                    changeLogView = vscode.window.createWebviewPanel('vscodeKanbanBoardChangelog', 'Kanban ChangeLog', vscode.ViewColumn.One, {
                                        enableCommandUris: false,
                                        enableFindWidget: false,
                                        enableScripts: false,
                                        retainContextWhenHidden: true,
                                    });
                                    changeLogView.webview.html = Marked(MARKDOWN, {
                                        breaks: true,
                                        gfm: true,
                                        mangle: true,
                                        silent: true,
                                        tables: true,
                                        sanitize: true,
                                    });
                                }
                                catch (e) {
                                    vscode_helpers.tryDispose(changeLogView);
                                    throw e;
                                }
                            }
                            versionToUpdate = VERSION;
                        }
                    }
                }
            }
            catch (_b) {
            }
            finally {
                try {
                    if (false !== versionToUpdate) {
                        yield context.globalState.update(KEY_LAST_KNOWN_VERSION, versionToUpdate);
                    }
                }
                catch (_c) { }
            }
        }));
        if (!isDeactivating) {
            yield WF.start();
        }
    });
}
exports.activate = activate;
function createNewWorkspace(folder, extension) {
    return __awaiter(this, void 0, void 0, function* () {
        let newWorkspace;
        try {
            newWorkspace = new vsckb_workspaces.Workspace(folder, extension);
            yield newWorkspace.initialize();
            return newWorkspace;
        }
        catch (e) {
            vscode_helpers.tryDispose(newWorkspace);
            throw e;
        }
    });
}
function deactivate() {
    if (isDeactivating) {
        return;
    }
    isDeactivating = true;
}
exports.deactivate = deactivate;
/**
 * Returns the full path of the extension's directory.
 *
 * @return {string} The extension's directory.
 */
function getExtensionDir() {
    return Path.resolve(Path.join(OS.homedir(), exports.EXTENSION_DIR));
}
exports.getExtensionDir = getExtensionDir;
/**
 * Returns the global logger.
 *
 * @return {vscode_helpers.Logger} The logger.
 */
function getLogger() {
    return logger;
}
exports.getLogger = getLogger;
/**
 * Returns all possible resource URIs for web views.
 *
 * @return {vscode.Uri[]} The list of URIs.
 */
function getWebViewResourceUris() {
    const URIs = [];
    try {
        URIs.push(vscode.Uri.file(Path.resolve(Path.join(__dirname, './res'))));
    }
    catch (_a) { }
    return URIs;
}
exports.getWebViewResourceUris = getWebViewResourceUris;
/**
 * Opens a target.
 *
 * @param {string} target The target to open.
 * @param {OpenOptions} [opts] The custom options to set.
 *
 * @param {Promise<ChildProcess.ChildProcess>} The promise with the child process.
 */
function open(target, opts) {
    if (!opts) {
        opts = {};
    }
    target = vscode_helpers.toStringSafe(target);
    const WAIT = vscode_helpers.toBooleanSafe(opts.wait, true);
    return new Promise((resolve, reject) => {
        const COMPLETED = vscode_helpers.createCompletedAction(resolve, reject);
        try {
            let app = opts.app;
            let cmd;
            let appArgs = [];
            let args = [];
            let cpOpts = {
                cwd: opts.cwd,
                env: opts.env,
            };
            if (Array.isArray(app)) {
                appArgs = app.slice(1);
                app = opts.app[0];
            }
            if (process.platform === 'darwin') {
                // Apple
                cmd = 'open';
                if (WAIT) {
                    args.push('-W');
                }
                if (app) {
                    args.push('-a', app);
                }
            }
            else if (process.platform === 'win32') {
                // Microsoft
                cmd = 'cmd';
                args.push('/c', 'start', '""');
                target = target.replace(/&/g, '^&');
                if (WAIT) {
                    args.push('/wait');
                }
                if (app) {
                    args.push(app);
                }
                if (appArgs.length > 0) {
                    args = args.concat(appArgs);
                }
            }
            else {
                // Unix / Linux
                if (app) {
                    cmd = app;
                }
                else {
                    cmd = Path.join(__dirname, 'xdg-open');
                }
                if (appArgs.length > 0) {
                    args = args.concat(appArgs);
                }
                if (!WAIT) {
                    // xdg-open will block the process unless
                    // stdio is ignored even if it's unref'd
                    cpOpts.stdio = 'ignore';
                }
            }
            args.push(target);
            if (process.platform === 'darwin' && appArgs.length > 0) {
                args.push('--args');
                args = args.concat(appArgs);
            }
            let cp = ChildProcess.spawn(cmd, args, cpOpts);
            if (WAIT) {
                cp.once('error', (err) => {
                    COMPLETED(err);
                });
                cp.once('close', function (code) {
                    if (code > 0) {
                        COMPLETED(new Error('Exited with code ' + code));
                        return;
                    }
                    COMPLETED(null, cp);
                });
            }
            else {
                cp.unref();
                COMPLETED(null, cp);
            }
        }
        catch (e) {
            COMPLETED(e);
        }
    });
}
exports.open = open;
/**
 * Saves data to a file and creates the directory, if needed.
 *
 * @param {string} path The path to the file.
 * @param {any} data The data to save.
 */
function saveToFile(path, data) {
    return __awaiter(this, void 0, void 0, function* () {
        path = vscode_helpers.toStringSafe(path);
        yield vscode_helpers.createDirectoryIfNeeded(Path.dirname(path));
        yield FSExtra.writeFile(path, data);
    });
}
exports.saveToFile = saveToFile;
/**
 * Shows an error.
 *
 * @param {any} err The error to show.
 */
function showError(err) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!_.isNil(err)) {
            getLogger().trace(err, 'showError()');
            return yield vscode.window.showErrorMessage(`[ERROR] '${vscode_helpers.toStringSafe(err)}'`);
        }
    });
}
exports.showError = showError;
//# sourceMappingURL=extension.js.map