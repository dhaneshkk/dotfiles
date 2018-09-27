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
const HtmlEntities = require("html-entities");
const HumanizeDuration = require('humanize-duration');
const Moment = require("moment");
const Path = require("path");
const SanitizeFilename = require("sanitize-filename");
const vsckb = require("./extension");
const vsckb_boards = require("./boards");
const vsckb_toggl = require("./toggl");
const vscode = require("vscode");
const vscode_helpers = require("vscode-helpers");
const BOARD_FILENAME = 'vscode-kanban.json';
const BOARD_CARD_EXPORT_FILE_EXT = 'card.md';
const EVENT_TRACK_TIME = 'track_time';
const FILTER_FILENAME = 'vscode-kanban.filter';
const SCRIPT_FILENAME = 'vscode-kanban.js';
/**
 * A workspace.
 */
class Workspace extends vscode_helpers.WorkspaceBase {
    /**
     * Initializes a new instance of that class.
     *
     * @param {vscode.WorkspaceFolder} folder The underlying folder.
     * @param {vscode.ExtensionContext} extension The exitension context.
     */
    constructor(folder, extension) {
        super(folder);
        this.extension = extension;
        this._isReloadingConfig = false;
        this._STATE = {};
    }
    get boardFile() {
        return vscode.Uri.file(Path.resolve(Path.join(this.folder.uri.fsPath, '.vscode/' + BOARD_FILENAME)));
    }
    /**
     * Gets if the workspace is setup for 'time tracking' or not.
     */
    get canTrackTime() {
        const CFG = this.config;
        if (CFG) {
            return !_.isNil(CFG.trackTime) &&
                (false !== CFG.trackTime);
        }
    }
    /**
     * Gets the current configuration.
     */
    get config() {
        return this._config;
    }
    /**
     * @inheritdoc
     */
    get configSource() {
        return this._configSrc;
    }
    /**
     * Initializes that workspace object.
     */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this._configSrc = {
                section: 'kanban',
                resource: vscode.Uri.file(Path.join(this.rootPath, '.vscode/settings.json')),
            };
            yield this.onDidChangeConfiguration();
        });
    }
    /**
     * @inheritdoc
     */
    onDidChangeConfiguration() {
        return __awaiter(this, arguments, void 0, function* () {
            if (this._isReloadingConfig) {
                const ARGS = arguments;
                vscode_helpers.invokeAfter(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.onDidChangeConfiguration
                        .apply(this, ARGS);
                }), 1000);
                return;
            }
            this._isReloadingConfig = true;
            try {
                let loadedCfg = vscode.workspace.getConfiguration(this.configSource.section, this.configSource.resource) || {};
                this._config = loadedCfg;
                yield this.openBoardOnStartup(loadedCfg);
            }
            finally {
                this._isReloadingConfig = false;
            }
        });
    }
    /**
     * Opens the kanban board for that workspace.
     */
    openBoard() {
        return __awaiter(this, void 0, void 0, function* () {
            const CFG = this.config;
            if (!CFG) {
                return;
            }
            const KANBAN_FILE = Path.resolve(this.boardFile.fsPath);
            const FILTER_FILE = Path.resolve(Path.join(Path.dirname(KANBAN_FILE), FILTER_FILENAME));
            const VSCODE_DIR = Path.resolve(Path.dirname(KANBAN_FILE));
            if (!(yield vscode_helpers.exists(KANBAN_FILE))) {
                if (!(yield vscode_helpers.exists(VSCODE_DIR))) {
                    yield FSExtra.mkdirs(VSCODE_DIR);
                }
                if (!(yield vscode_helpers.isDirectory(VSCODE_DIR))) {
                    vscode.window.showWarningMessage(`'${VSCODE_DIR}' is no directory!`);
                    return;
                }
                yield saveBoardTo(vsckb_boards.newBoard(), KANBAN_FILE);
            }
            if (!(yield vscode_helpers.isFile(KANBAN_FILE))) {
                vscode.window.showWarningMessage(`'${KANBAN_FILE}' is no file!`);
                return;
            }
            let title = vscode_helpers.toStringSafe(this.folder.name).trim();
            if ('' === title) {
                title = `Workspace #${this.folder.index}`;
            }
            const COL_SETTINGS_DONE = {};
            const COL_SETTINGS_IN_PROGRESS = {};
            const COL_SETTINGS_TESTING = {};
            let COL_SETTINGS_TODO = {};
            if (CFG.columns) {
                COL_SETTINGS_DONE.name = vscode_helpers.toStringSafe(CFG.columns.done).trim();
                COL_SETTINGS_IN_PROGRESS.name = vscode_helpers.toStringSafe(CFG.columns.inProgress).trim();
                COL_SETTINGS_TESTING.name = vscode_helpers.toStringSafe(CFG.columns.testing).trim();
                COL_SETTINGS_TODO.name = vscode_helpers.toStringSafe(CFG.columns.todo).trim();
            }
            yield vsckb_boards.openBoard({
                additionalResourceRoots: [
                    vscode.Uri.file(Path.resolve(Path.join(this.folder.uri.fsPath, '.vscode')))
                ],
                fileResolver: () => this.boardFile,
                git: yield this.tryCreateGitClient(),
                loadFilter: () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (yield vscode_helpers.isFile(FILTER_FILE, false)) {
                            return yield FSExtra.readFile(FILTER_FILE, 'utf8');
                        }
                    }
                    catch (e) {
                        this.showError(e);
                    }
                    return '';
                }),
                noScmUser: CFG.noScmUser,
                noSystemUser: CFG.noSystemUser,
                raiseEvent: (ctx) => __awaiter(this, void 0, void 0, function* () {
                    yield this.raiseEvent(ctx);
                }),
                saveBoard: (board) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield saveBoardTo(board, this.boardFile.fsPath);
                    }
                    catch (e) {
                        vsckb.showError(e);
                    }
                    if (vscode_helpers.toBooleanSafe(CFG.exportOnSave)) {
                        try {
                            const VSCODE_DIR = Path.join(this.folder.uri.fsPath, '.vscode');
                            let exportPath = vscode_helpers.toStringSafe(CFG.exportPath);
                            if (vscode_helpers.isEmptyString(exportPath)) {
                                exportPath = VSCODE_DIR;
                            }
                            if (!Path.isAbsolute(exportPath)) {
                                exportPath = Path.join(VSCODE_DIR, exportPath);
                            }
                            exportPath = Path.resolve(exportPath);
                            let maxNameLength = parseInt(vscode_helpers.toStringSafe(CFG.maxExportNameLength).trim());
                            if (isNaN(maxNameLength)) {
                                maxNameLength = 0;
                            }
                            if (maxNameLength < 1) {
                                maxNameLength = 48;
                            }
                            yield exportBoardCardsTo({
                                board: board,
                                cleanup: vscode_helpers.toBooleanSafe(CFG.cleanupExports, true),
                                dir: exportPath,
                                maxNameLength: maxNameLength,
                            });
                        }
                        catch (e) {
                            vsckb.showError(e);
                        }
                    }
                }),
                saveFilter: (filter) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield vsckb.saveToFile(FILTER_FILE, new Buffer(filter, 'utf8'));
                    }
                    catch (e) {
                        vsckb.showError(e);
                    }
                }),
                settings: {
                    canExecute: vscode_helpers.toBooleanSafe(this.config.canExecute),
                    canTrackTime: this.canTrackTime,
                    columns: {
                        done: COL_SETTINGS_DONE,
                        'in-progress': COL_SETTINGS_IN_PROGRESS,
                        testing: COL_SETTINGS_TESTING,
                        todo: COL_SETTINGS_TODO,
                    },
                    hideTimeTrackingIfIdle: vscode_helpers.toBooleanSafe(CFG.noTimeTrackingIfIdle),
                    simpleIDs: vscode_helpers.toBooleanSafe(CFG.simpleIDs, true),
                },
                title: title,
            });
        });
    }
    openBoardOnStartup(cfg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (vscode_helpers.toBooleanSafe(cfg.openOnStartup)) {
                    yield this.openBoard();
                }
            }
            catch (e) {
                this.showError(e);
            }
        });
    }
    raiseEvent(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const CFG = this.config;
            if (!CFG) {
                return;
            }
            let func;
            let options;
            let setupUID = true;
            let setupTag = true;
            const SETUP_FOR_TRACK_TIME = () => {
                setupUID = true;
                setupTag = true;
            };
            let thisArg;
            const ARGS = {
                data: context.data,
                extension: this.extension,
                file: Path.resolve(this.boardFile.fsPath),
                globals: vscode_helpers.cloneObject(CFG.globals),
                logger: vsckb.getLogger(),
                name: context.name,
                require: (id) => {
                    return require(vscode_helpers.toStringSafe(id));
                },
                session: vscode_helpers.SESSION,
                state: this._STATE,
            };
            const GET_UID = (arg) => {
                if (!_.isNil(arg)) {
                    let card;
                    if (_.isObject(arg)) {
                        card = arg;
                    }
                    else {
                        const UID = vscode_helpers.normalizeString(arg);
                        if (!_.isNil(ARGS.data) && !_.isNil(ARGS.data.others)) {
                            for (const COLUMN in ARGS.data.others) {
                                const CARDS_OF_COLUMN = vscode_helpers.asArray(ARGS.data.others[COLUMN]);
                                for (const C of CARDS_OF_COLUMN) {
                                    if (C['__uid'] === UID) {
                                        card = C;
                                        break;
                                    }
                                }
                                if (!_.isNil(card)) {
                                    break;
                                }
                            }
                        }
                    }
                    if (_.isNil(card)) {
                        throw new Error('Card not found');
                    }
                    return card['__uid'];
                }
                return ARGS['uid'];
            };
            const TRY_FIND_CARD = (uid) => {
                if (!_.isNil(ARGS.data)) {
                    // check for CURRENT card
                    if (!_.isNil(ARGS.data.card)) {
                        if (uid === ARGS.data.card['__uid']) {
                            return ARGS.data.card;
                        }
                    }
                    // now check for OTHER cards
                    if (!_.isNil(ARGS.data.others)) {
                        for (const COLUMN in ARGS.data.others) {
                            const CARDS_OF_COLUMN = vscode_helpers.asArray(ARGS.data.others[COLUMN]);
                            for (const C of CARDS_OF_COLUMN) {
                                if (uid === C['__uid']) {
                                    return C;
                                }
                            }
                        }
                    }
                }
            };
            const MOVE_TO = (uid, column) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    result = yield context.postMessage('moveCardTo', {
                        column: column,
                        uid: uid,
                    });
                }
                catch (_a) {
                    result = false;
                }
                return result;
            });
            if (EVENT_TRACK_TIME === context.name) {
                if (this.canTrackTime) {
                    thisArg = this;
                    if (_.isObject(CFG.trackTime)) {
                        const SETTINGS = CFG.trackTime;
                        switch (SETTINGS.type) {
                            case '':
                            case 'script':
                                {
                                    const SCRIPT_SETTINGS = SETTINGS;
                                    options = SCRIPT_SETTINGS.options;
                                }
                                break;
                            case 'toggl':
                            case 'toggle':
                                {
                                    const TOGGLE_SETTINGS = SETTINGS;
                                    func = () => __awaiter(this, void 0, void 0, function* () {
                                        yield vscode_helpers.applyFuncFor(vsckb_toggl.trackTime, this)(ARGS, TOGGLE_SETTINGS);
                                    });
                                }
                                break;
                            default:
                                return; // not supported
                        }
                    }
                    else {
                        if (vscode_helpers.toBooleanSafe(CFG.trackTime)) {
                            func = this.trackTime;
                            SETUP_FOR_TRACK_TIME();
                        }
                    }
                }
            }
            if (!func) {
                const SCRIPT_FILE = vscode.Uri.file(Path.join(this.rootPath, '.vscode/' + SCRIPT_FILENAME));
                try {
                    if (!(yield vscode_helpers.isFile(SCRIPT_FILE.fsPath, false))) {
                        return;
                    }
                }
                catch (_b) { }
                const SCRIPT_MODULE = thisArg = vscode_helpers.loadModule(SCRIPT_FILE.fsPath);
                if (SCRIPT_MODULE) {
                    switch (context.name) {
                        case 'card_created':
                            func = SCRIPT_MODULE.onCardCreated;
                            break;
                        case 'card_deleted':
                            func = SCRIPT_MODULE.onCardDeleted;
                            break;
                        case 'card_moved':
                            func = SCRIPT_MODULE.onCardMoved;
                            break;
                        case 'card_updated':
                            func = SCRIPT_MODULE.onCardUpdated;
                            break;
                        case 'column_cleared':
                            setupUID = false;
                            setupTag = false;
                            func = SCRIPT_MODULE.onColumnCleared;
                            break;
                        case 'execute_card':
                            func = SCRIPT_MODULE.onExecute;
                            break;
                        case EVENT_TRACK_TIME:
                            func = SCRIPT_MODULE.onTrackTime;
                            SETUP_FOR_TRACK_TIME();
                            break;
                    }
                    if (!func) {
                        func = SCRIPT_MODULE.onEvent; // try use fallback
                    }
                }
            }
            // ARGS.options
            ARGS.options = vscode_helpers.cloneObject(options);
            if (setupTag) {
                // ARGS.tag
                Object.defineProperty(ARGS, 'tag', {
                    enumerable: true,
                    get: function () {
                        return this.data.card.tag;
                    }
                });
            }
            if (setupUID) {
                // ARGS.uid
                Object.defineProperty(ARGS, 'uid', {
                    enumerable: true,
                    get: function () {
                        return this.data.card.__uid;
                    }
                });
            }
            // ARGS.setTag()
            ARGS['setTag'] = function (tag, card) {
                return __awaiter(this, void 0, void 0, function* () {
                    const UID = GET_UID(card);
                    let result;
                    try {
                        result = yield context.postMessage('setCardTag', {
                            tag: tag,
                            uid: UID,
                        });
                    }
                    catch (_a) {
                        result = false;
                    }
                    if (result) {
                        const CARD = TRY_FIND_CARD(UID);
                        if (CARD) {
                            CARD.tag = tag;
                        }
                    }
                    return result;
                });
            };
            // move cards
            {
                ARGS['moveToDone'] = function (card) {
                    return MOVE_TO(GET_UID(card), 'done');
                };
                ARGS['moveToInProgress'] = function (card) {
                    return MOVE_TO(GET_UID(card), 'in-progress');
                };
                ARGS['moveToTesting'] = function (card) {
                    return MOVE_TO(GET_UID(card), 'testing');
                };
                ARGS['moveToTodo'] = function (card) {
                    return MOVE_TO(GET_UID(card), 'todo');
                };
            }
            if (func) {
                yield Promise.resolve(func.apply(thisArg, [ARGS]));
            }
        });
    }
    showError(err) {
        return vsckb.showError(err);
    }
    trackTime(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let tag = args.tag;
            if (_.isNil(tag)) {
                tag = {}; // initialize card's 'tag'
            }
            if (_.isNil(tag['time-tracking'])) {
                // initialize 'time-tracking' property
                // of card's 'tag'
                tag['time-tracking'] = {
                    'seconds': 0,
                    'entries': []
                };
            }
            // add current time
            // as UTC
            tag['time-tracking']['entries'].push(Moment.utc()
                .toISOString());
            let seconds = 0.0;
            let lastStartTime = false;
            for (let i = 0; i < tag['time-tracking']['entries'].length; i++) {
                const TIME = Moment.utc(tag['time-tracking']['entries'][i]);
                if (false === lastStartTime) {
                    // start time
                    lastStartTime = TIME;
                }
                else {
                    // end time
                    // calculate difference
                    // and add value
                    seconds += Moment.duration(TIME.diff(lastStartTime))
                        .asSeconds();
                    lastStartTime = false;
                }
            }
            // store sum
            tag['time-tracking']['seconds'] = seconds;
            yield args.setTag(tag);
            if (Moment.isMoment(lastStartTime)) {
                vscode.window.showInformationMessage('Time tracking has been started.');
            }
            else {
                vscode.window.showInformationMessage(`Time tracking has been STOPPED. Current duration: ${HumanizeDuration(seconds * 1000.0)}`);
            }
        });
    }
    tryCreateGitClient() {
        return vscode_helpers.tryCreateGitClient(this.folder.uri.fsPath);
    }
}
exports.Workspace = Workspace;
function exportBoardCardsTo(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        let board = opts.board;
        if (_.isNil(board)) {
            board = vsckb_boards.newBoard();
        }
        let dir = opts.dir;
        yield vscode_helpers.createDirectoryIfNeeded(dir);
        const HTML_ENCODER = new HtmlEntities.AllHtmlEntities();
        const FILENAME_FORMAT = 'vscode-kanban_{0}_{1}_{2}';
        if (opts.cleanup) {
            const EXITING_FILES = (yield vscode_helpers.glob('/vscode-kanban_*.' + BOARD_CARD_EXPORT_FILE_EXT, {
                absolute: true,
                cwd: dir,
                dot: false,
                nocase: true,
                nodir: true,
                nonull: false,
                nosort: true,
                nounique: false,
                root: dir,
            }));
            for (const EF of EXITING_FILES) {
                yield FSExtra.unlink(EF);
            }
        }
        const EXTRACT_BOARD_CARD_CONTENT = (value) => {
            let content;
            if (!_.isNil(value)) {
                let cardContent;
                if (_.isObject(value)) {
                    cardContent = value;
                }
                else {
                    cardContent = {
                        content: vscode_helpers.toStringSafe(value),
                    };
                }
                content = vscode_helpers.toStringSafe(cardContent.content);
            }
            return content;
        };
        let index = 0;
        for (const BC of vsckb_boards.BOARD_COLMNS) {
            const CARDS = vscode_helpers.asArray(board[BC]);
            let columnIndex = 0;
            for (const C of CARDS) {
                ++index;
                ++columnIndex;
                const DESCRIPTION = EXTRACT_BOARD_CARD_CONTENT(C.description);
                const DETAILS = EXTRACT_BOARD_CARD_CONTENT(C.details);
                let filename = vscode_helpers.format(FILENAME_FORMAT, BC, // {0}
                columnIndex, // {1}
                vscode_helpers.toStringSafe(C.title).trim()).trim();
                filename = SanitizeFilename(filename).trim();
                if (filename.length > opts.maxNameLength) {
                    filename = filename.substr(0, opts.maxNameLength);
                }
                let outputFile;
                let filenameSuffix;
                do {
                    outputFile = filename;
                    if (!isNaN(filenameSuffix)) {
                        --filenameSuffix;
                        outputFile += filenameSuffix;
                    }
                    else {
                        filenameSuffix = 0;
                    }
                    outputFile = Path.join(dir, outputFile + '.' + BOARD_CARD_EXPORT_FILE_EXT);
                    if (!(yield vscode_helpers.exists(outputFile))) {
                        break;
                    }
                } while (true);
                let type = vscode_helpers.normalizeString(C.type);
                if ('' === type) {
                    type = 'note';
                }
                const META = {
                    'Column': BC,
                    'Type': type,
                };
                let category = vscode_helpers.toStringSafe(C.category).trim();
                if ('' !== category) {
                    META['Category'] = category;
                }
                let creationTime = vscode_helpers.toStringSafe(C.creation_time).trim();
                if ('' !== creationTime) {
                    try {
                        const CT = Moment.utc(creationTime);
                        if (CT.isValid()) {
                            META['Creation time'] = CT.format('YYYY-MM-DD HH:mm:ss') + ' (UTC)';
                        }
                    }
                    catch (_a) { }
                }
                if (!_.isNil(C.assignedTo)) {
                    let assignedTo = vscode_helpers.toStringSafe(C.assignedTo.name).trim();
                    if ('' !== assignedTo) {
                        META['Assigned to'] = assignedTo;
                    }
                }
                let md = `# ${HTML_ENCODER.encode(vscode_helpers.toStringSafe(C.title).trim())}

## Meta
`;
                for (const M of Object.keys(META).sort()) {
                    md += `
* ${HTML_ENCODER.encode(M)}: \`${HTML_ENCODER.encode(META[M])}\``;
                }
                if (!vscode_helpers.isEmptyString(DESCRIPTION)) {
                    md += `

## Description

${vscode_helpers.toStringSafe(DESCRIPTION)}`;
                }
                if (!vscode_helpers.isEmptyString(DETAILS)) {
                    md += `

## Details

${vscode_helpers.toStringSafe(DETAILS)}`;
                }
                md += `

---

<sup>This document was generated by [Visual Studio Code](https://code.visualstudio.com/) extension [vscode-kanban](https://marketplace.visualstudio.com/items?itemName=mkloubert.vscode-kanban).</sup>`;
                yield FSExtra.writeFile(outputFile, md, 'utf8');
            }
        }
    });
}
function saveBoardTo(board, file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (_.isNil(board)) {
            board = vsckb_boards.newBoard();
        }
        yield FSExtra.writeFile(file, JSON.stringify(board, null, 2), 'utf8');
    });
}
//# sourceMappingURL=workspaces.js.map