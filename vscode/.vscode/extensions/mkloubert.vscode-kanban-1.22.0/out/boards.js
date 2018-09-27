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
const OS = require("os");
const Path = require("path");
const URL = require("url");
const vsckb = require("./extension");
const vsckb_html = require("./html");
const vscode = require("vscode");
const vscode_helpers = require("vscode-helpers");
/**
 * List of board card columns.
 */
exports.BOARD_COLMNS = [
    'todo',
    'in-progress',
    'testing',
    'done',
];
const KNOWN_URLS = {
    'filter-help': 'https://github.com/mkloubert/vscode-kanban#filter-',
    'github': 'https://github.com/mkloubert/vscode-kanban',
    'mermaid-help': 'https://mermaidjs.github.io',
    'markdown-help': 'https://github.com/showdownjs/showdown/wiki',
    'paypal': 'https://paypal.me/MarcelKloubert',
    'twitter': 'https://twitter.com/mjkloubert',
};
/**
 * A kanban board.
 */
class KanbanBoard extends vscode_helpers.DisposableBase {
    /**
     * Gets the board file to use.
     */
    get file() {
        const RESOLVER = this.openOptions.fileResolver;
        if (RESOLVER) {
            return RESOLVER();
        }
    }
    generateHTML() {
        const HTML_ENC = new HtmlEntities.AllHtmlEntities();
        const GET_RES_URI = (p) => {
            return this.getResourceUri(p);
        };
        const GET_COLUMN_NAME = (column, defaultName) => {
            let name;
            if (!_.isNil(this.openOptions)) {
                if (!_.isNil(this.openOptions.settings)) {
                    if (!_.isNil(this.openOptions.settings.columns)) {
                        const COL_SETTINGS = this.openOptions.settings.columns[column];
                        if (!_.isNil(COL_SETTINGS)) {
                            name = COL_SETTINGS.name;
                        }
                    }
                }
            }
            name = vscode_helpers.toStringSafe(name).trim();
            if ('' === name) {
                name = vscode_helpers.toStringSafe(defaultName).trim();
            }
            return name;
        };
        return vsckb_html.generateHtmlDocument({
            getContent: () => {
                return `
<main role="main" class="container-fluid h-100">
    <div class="row h-100">
        <div class="col col-6 col-md-3 h-100">
            <div class="card text-dark bg-secondary vsckb-card" id="vsckb-card-todo">
                <div class="card-header font-weight-bold vsckb-primary-card-header border border-dark border-bottom-0 text-dark">
                    <span class="vsckb-title">${HTML_ENC.encode(GET_COLUMN_NAME('todo', 'Todo'))}</span>

                    <div class="vsckb-buttons float-right">
                        <a class="btn btn-sm vsckb-add-btn" title="Add Card ...">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>

                <div class="card-body vsckb-primary-card-body h-100 bg-light border border-dark">&nbsp;</div>
            </div>
        </div>

        <div class="col col-6 col-md-3 h-100">
            <div class="card text-white bg-primary vsckb-card" id="vsckb-card-in-progress">
                <div class="card-header font-weight-bold vsckb-primary-card-header border border-dark border-bottom-0 text-white">
                    <span class="vsckb-title">${HTML_ENC.encode(GET_COLUMN_NAME('in-progress', 'In Progress'))}</span>

                    <div class="vsckb-buttons float-right">
                        <a class="btn btn-sm vsckb-add-btn" title="Add Card ...">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>

                <div class="card-body vsckb-primary-card-body h-100 bg-light border border-dark">&nbsp;</div>
            </div>
        </div>

        <div class="col col-6 col-md-3 h-100">
            <div class="card text-white bg-warning vsckb-card" id="vsckb-card-testing">
                <div class="card-header font-weight-bold vsckb-primary-card-header border border-dark border-bottom-0 text-white">
                    <span class="vsckb-title">${HTML_ENC.encode(GET_COLUMN_NAME('testing', 'Testing'))}</span>

                    <div class="vsckb-buttons float-right">
                        <a class="btn btn-sm vsckb-add-btn" title="Add Card ...">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>

                <div class="card-body vsckb-primary-card-body h-100 bg-light border border-dark">&nbsp;</div>
            </div>
        </div>

        <div class="col col-6 col-md-3 h-100">
            <div class="card text-white bg-success vsckb-card" id="vsckb-card-done">
                <div class="card-header font-weight-bold vsckb-primary-card-header border border-dark border-bottom-0 text-white">
                    <span class="vsckb-title">${HTML_ENC.encode(GET_COLUMN_NAME('done', 'Done'))}</span>

                    <div class="vsckb-buttons float-right">
                        <a class="btn btn-sm vsckb-clear-btn" title="Clear ...">
                            <i class="fa fa-eraser" aria-hidden="true"></i>
                        </a>

                        <a class="btn btn-sm vsckb-add-btn" title="Add Card ...">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>

                <div class="card-body vsckb-primary-card-body h-100 bg-light border border-dark">&nbsp;</div>
            </div>
        </div>
    </div>
</main>
`;
            },
            getFooter: () => {
                const CUSTOM_STYLE_FILE = GET_RES_URI('vscode-kanban.css');
                return `
<div class="modal" tabindex="-1" role="dialog" id="vsckb-add-card-modal" data-keyboard="false">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add Card</h5>

                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <label for="vsckb-new-card-title">Title</label>
                        <input type="text" class="form-control" id="vsckb-new-card-title">
                    </div>

                    <div class="row">
                        <div class="col col-10">
                            <div class="form-group vsckb-card-type-list">
                                <label for="vsckb-new-card-type">Type</label>
                                <select id="vsckb-new-card-type" class="form-control"></select>
                            </div>
                        </div>

                        <div class="col col-2">
                            <div class="form-group">
                                <label for="vsckb-new-card-prio">Prio</label>
                                <input type="number" id="vsckb-new-card-prio" class="form-control" placeholder="0"></input>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="vsckb-new-card-category">Category</label>
                        <input type="text" class="form-control" id="vsckb-new-card-category">
                    </div>

                    <div class="form-group vsckb-card-assigned-to">
                        <label for="vsckb-new-card-assigned-to">Assigned To</label>
                        <input type="text" class="form-control" id="vsckb-new-card-assigned-to">
                    </div>

                    <div class="row">
                        <div class="col col-12">
                            <ul class="nav nav-pills vsckb-card-description-details-tablist" id="vsckb-new-card-description-details-tablist" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="vsckb-new-card-description-tab" data-toggle="pill" href="#vsckb-new-card-description-tab-pane" role="tab" aria-controls="vsckb-new-card-description-tab-pane" aria-selected="true">
                                        (Short) Description
                                    </a>
                                </li>

                                <li class="nav-item">
                                    <a class="nav-link" id="vsckb-new-card-details-tab" data-toggle="pill" href="#vsckb-new-card-details-tab-pane" role="tab" aria-controls="vsckb-new-card-details-tab-pane" aria-selected="false">
                                        Details
                                    </a>
                                </li>

                                <li class="nav-item">
                                    <a class="nav-link" id="vsckb-new-card-references-tab" data-toggle="pill" href="#vsckb-new-card-references-tab-pane" role="tab" aria-controls="vsckb-new-card-references-tab-pane" aria-selected="false">
                                        References
                                    </a>
                                </li>
                            </ul>

                            <div class="tab-content vsckb-card-description-details-tab-content" id="vsckb-new-card-description-details-tab-content">
                                <div class="tab-pane form-group show active" id="vsckb-new-card-description-tab-pane" role="tabpanel" aria-labelledby="vsckb-new-card-description-tab">
                                    <textarea class="form-control vsckb-markdown-editor" id="vsckb-new-card-description" rows="5"></textarea>
                                </div>

                                <div class="tab-pane form-group" id="vsckb-new-card-details-tab-pane" role="tabpanel" aria-labelledby="vsckb-new-card-details-tab">
                                    <textarea class="form-control vsckb-markdown-editor" id="vsckb-new-card-details" rows="7"></textarea>
                                </div>

                                <div class="tab-pane form-group vsckb-card-references-tab-pane" id="vsckb-new-card-references-tab-pane" role="tabpanel" aria-labelledby="vsckb-new-card-references-tab">
                                    <nav class="navbar navbar-light bg-light">
                                        <form class="row form-inline" style="margin: 0; padding: 0;">
                                            <div class="col" style="display: table; margin: 0; padding: 0;">
                                                <div style="display: table-cell;">
                                                    <select class="form-control vsckb-card-list"></select>
                                                </div>

                                                <div style="display: table-cell; width: 32px; padding: 8px; top: -2px; position: relative;">
                                                    <a class="btn btn-sm btn-primary text-white vsckb-add-link-to-card-btn text-center align-middle" title="Add Link To Card ..." id="vsckb-edit-card-add-link-btn">
                                                        <i class="fa fa-link" aria-hidden="true"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </form>
                                    </nav>

                                    <div class="vsckb-list-of-linked-cards"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div class="row">
                    <div class="col col-12">
                        <div class="vsckb-help-link">
                            <i class="fa fa-question-circle" aria-hidden="true"></i> <a href="#" class="vsckb-with-known-url" vsckb-url="markdown-help">Markdown Help</a>
                        </div>

                        <div class="vsckb-help-link">
                            <i class="fa fa-question-circle" aria-hidden="true"></i> <a href="#" class="vsckb-with-known-url" vsckb-url="mermaid-help">Diagram Help</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <a class="btn btn-primary text-white">
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>

                    <span>Add</span>
                </a>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="vsckb-delete-card-modal">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title">Delete Card</h5>

                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body"></div>

            <div class="modal-footer">
                <a class="btn btn-warning text-white font-weight-bold vsckb-no-btn">
                    <span>NO!</span>
                </a>

                <a class="btn btn-danger text-white vsckb-yes-btn">
                    <span>Yes</span>
                </a>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="vsckb-edit-card-modal" data-keyboard="false">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Edit Card</h5>

                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <label for="vsckb-edit-card-title">Title</label>
                        <input type="text" class="form-control" id="vsckb-edit-card-title">
                    </div>

                    <div class="row">
                        <div class="col col-10">
                            <div class="form-group vsckb-card-type-list">
                                <label for="vsckb-edit-card-type">Type</label>
                                <select id="vsckb-edit-card-type" class="form-control"></select>
                            </div>
                        </div>

                        <div class="col col-2">
                            <div class="form-group">
                                <label for="vsckb-edit-card-prio">Prio</label>
                                <input type="number" id="vsckb-edit-card-prio" class="form-control" placeholder="0"></input>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="vsckb-edit-card-category">Category</label>
                        <input type="text" class="form-control" id="vsckb-edit-card-category">
                    </div>

                    <div class="form-group vsckb-card-assigned-to">
                        <label for="vsckb-edit-card-assigned-to">Assigned To</label>
                        <input type="text" class="form-control" id="vsckb-edit-card-assigned-to">
                    </div>

                    <div class="row">
                        <div class="col col-12">
                            <ul class="nav nav-pills vsckb-card-description-details-tablist" id="vsckb-edit-card-description-details-tablist" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="vsckb-edit-card-description-tab" data-toggle="pill" href="#vsckb-edit-card-description-tab-pane" role="tab" aria-controls="vsckb-edit-card-description-tab-pane" aria-selected="true">
                                        (Short) Description
                                    </a>
                                </li>

                                <li class="nav-item">
                                    <a class="nav-link" id="vsckb-edit-card-details-tab" data-toggle="pill" href="#vsckb-edit-card-details-tab-pane" role="tab" aria-controls="vsckb-edit-card-details-tab-pane" aria-selected="false">
                                        Details
                                    </a>
                                </li>

                                <li class="nav-item">
                                    <a class="nav-link" id="vsckb-edit-card-references-tab" data-toggle="pill" href="#vsckb-edit-card-references-tab-pane" role="tab" aria-controls="vsckb-edit-card-references-tab-pane" aria-selected="false">
                                        References
                                    </a>
                                </li>
                            </ul>

                            <div class="tab-content vsckb-card-description-details-tab-content" id="vsckb-edit-card-description-details-tab-content">
                                <div class="tab-pane form-group show active" id="vsckb-edit-card-description-tab-pane" role="tabpanel" aria-labelledby="vsckb-edit-card-description-tab">
                                    <textarea class="form-control vsckb-markdown-editor" id="vsckb-edit-card-description" rows="5" maxlength="255"></textarea>
                                </div>

                                <div class="tab-pane form-group" id="vsckb-edit-card-details-tab-pane" role="tabpanel" aria-labelledby="vsckb-edit-card-details-tab">
                                    <textarea class="form-control vsckb-markdown-editor" id="vsckb-edit-card-details" rows="7"></textarea>
                                </div>

                                <div class="tab-pane form-group vsckb-card-references-tab-pane" id="vsckb-edit-card-references-tab-pane" role="tabpanel" aria-labelledby="vsckb-edit-card-references-tab">
                                    <nav class="navbar navbar-light bg-light">
                                        <form class="row form-inline" style="margin: 0; padding: 0;">
                                            <div class="col" style="display: table; margin: 0; padding: 0;">
                                                <div style="display: table-cell;">
                                                    <select class="form-control vsckb-card-list"></select>
                                                </div>

                                                <div style="display: table-cell; width: 32px; padding: 8px; top: -2px; position: relative;">
                                                    <a class="btn btn-sm btn-primary text-white vsckb-add-link-to-card-btn text-center align-middle" title="Add Link To Card ..." id="vsckb-edit-card-add-link-btn">
                                                        <i class="fa fa-link" aria-hidden="true"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </form>
                                    </nav>

                                    <div class="vsckb-list-of-linked-cards"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div class="row">
                    <div class="col col-12">
                        <div class="vsckb-help-link">
                            <i class="fa fa-question-circle" aria-hidden="true"></i> <a href="#" class="vsckb-with-known-url" vsckb-url="markdown-help">Markdown Help</a>
                        </div>

                        <div class="vsckb-help-link">
                            <i class="fa fa-question-circle" aria-hidden="true"></i> <a href="#" class="vsckb-with-known-url" vsckb-url="mermaid-help">Diagram Help</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <a class="btn btn-primary vsckb-save-btn text-white">
                    <i class="fa fa-floppy-o" aria-hidden="true"></i>

                    <span>Save</span>
                </a>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="vsckb-clear-done-modal">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header bg-warning text-white">
                <h5 class="modal-title"></h5>

                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <span>Do you really want to delete ALL cards in <strong>Done</strong>?</span>
            </div>

            <div class="modal-footer">
                <a class="btn btn-warning text-white font-weight-bold vsckb-no-btn">
                    <span>NO!</span>
                </a>

                <a class="btn btn-danger text-white vsckb-yes-btn">
                    <span>Yes</span>
                </a>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="vsckb-card-details-modal">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>

                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <div class="row">
                    <div class="col col-12 vsckb-badge-list"></div>
                </div>

                <div class="row">
                    <div class="col col-12 vsckb-body"></div>
                </div>
            </div>

            <div class="modal-footer">
                <a class="btn btn-primary vsckb-edit-btn text-white">
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>

                    <span>Edit</span>
                </a>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="vsckb-card-filter-modal">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header bg-dark text-white">
                <h5 class="modal-title">Filter</h5>

                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <div class="form-group">
                    <label for="vsckb-card-filter-expr">Expression</label>
                    <textarea type="text" class="form-control" id="vsckb-card-filter-expr" placeholder="example: type == &quot;emergency&quot; or is_bug" rows="7"></textarea>
                </div>

                <div class="row">
                    <div class="col col-12">
                        <i class="fa fa-question-circle" aria-hidden="true"></i> <a href="#" class="vsckb-with-known-url" vsckb-url="filter-help">Open Help</a>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <a class="btn btn-primary vsckb-apply-btn text-white">
                    <i class="fa fa-filter" aria-hidden="true"></i>

                    <span>Apply</span>
                </a>
            </div>
        </div>
    </div>
</div>

${CUSTOM_STYLE_FILE ? `<link rel="stylesheet" href="${CUSTOM_STYLE_FILE}">`
                    : ''}
`;
            },
            getHeaderButtons: () => {
                return `
<div id="vsckb-additional-header-btns">
    <a class="btn btn-primary btn-sm text-white" id="vsckb-filter-cards-btn" title="Filter">
        <i class="fa fa-filter" aria-hidden="true"></i>
    </a>

    <a class="btn btn-secondary btn-sm text-dark" id="vsckb-reload-board-btn" title="Reload Board">
        <i class="fa fa-refresh" aria-hidden="true"></i>
    </a>

    <a class="btn btn-secondary btn-sm text-dark" id="vsckb-save-board-btn" title="Save Board">
        <i class="fa fa-floppy-o" aria-hidden="true"></i>
    </a>
</div>
`;
            },
            getResourceUri: GET_RES_URI,
            name: 'board',
        });
    }
    getWebViewResourceUris() {
        const HOME_DIR = vscode.Uri.file(Path.resolve(OS.homedir()));
        return vscode_helpers.asArray(this.openOptions.additionalResourceRoots)
            .concat(HOME_DIR)
            .concat(vsckb.getWebViewResourceUris());
    }
    /**
     * Returns an URI from the 'resources' directory.
     *
     * @param {string} p The (relative) path.
     *
     * @return {vscode.Uri} The URI.
     */
    getResourceUri(p) {
        p = vscode_helpers.toStringSafe(p);
        let u;
        for (const R of this.getWebViewResourceUris()) {
            const PATH_TO_CHECK = Path.resolve(Path.join(R.fsPath, p));
            u = vscode.Uri.file(PATH_TO_CHECK).with({
                scheme: 'vscode-resource'
            });
            try {
                if (vscode_helpers.isFileSync(PATH_TO_CHECK, false)) {
                    break;
                }
            }
            catch (_a) { }
        }
        return u;
    }
    /**
     * Initializes the board.
     */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this._saveBoardEventListeners = [];
            this._saveBoardFilterEventListeners = [];
        });
    }
    /**
     * Is invoked after the underlying panel has been disposed.
     */
    onDispose() {
        this._saveBoardEventListeners = [];
        this._saveBoardFilterEventListeners = [];
        vscode_helpers.tryDispose(this._panel);
    }
    onLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            const FILE = this.file;
            if (!FILE) {
                return;
            }
            yield this.reloadBoard();
            yield this.postMessage('setTitleAndFilePath', {
                file: Path.resolve(this.file.fsPath),
                title: this.openOptions.title,
            });
            let userName;
            if (this.openOptions.git) {
                try {
                    const GIT_FOLDER = Path.resolve(Path.join(this.openOptions.git.cwd, '.git'));
                    if (yield vscode_helpers.isDirectory(GIT_FOLDER, false)) {
                        // only, if git repo exists
                        // try get username from Git?
                        if (!vscode_helpers.toBooleanSafe(this.openOptions.noScmUser)) {
                            try {
                                userName = vscode_helpers.toStringSafe(this.openOptions.git.execSync(['config', 'user.name'])).trim();
                            }
                            catch (_a) { }
                        }
                    }
                }
                catch (_b) { }
            }
            if (!vscode_helpers.toBooleanSafe(this.openOptions.noSystemUser)) {
                if (vscode_helpers.isEmptyString(userName)) {
                    // now try get username from operating system
                    try {
                        userName = OS.userInfo().username;
                    }
                    catch (_c) { }
                }
            }
            if (!vscode_helpers.isEmptyString(userName)) {
                yield this.postMessage('setCurrentUser', {
                    name: vscode_helpers.toStringSafe(userName).trim(),
                });
            }
        });
    }
    /**
     * Adds a listener for a 'save board' event.
     *
     * @param {SaveBoardEventListener} listener The listener to add.
     *
     * @return {this}
     */
    onSaveBoard(listener) {
        if (listener) {
            this._saveBoardEventListeners.push(listener);
        }
        return this;
    }
    /**
     * Adds a listener for a 'save board' event.
     *
     * @param {SaveBoardEventListener} listener The listener to add.
     *
     * @return {this}
     */
    onSaveBoardFilter(listener) {
        if (listener) {
            this._saveBoardFilterEventListeners.push(listener);
        }
        return this;
    }
    /**
     * Opens the board.
     *
     * @param {OpenBoardOptions} [opts] The options.
     *
     * @return {Promise<boolean>} The promise that indicates if operation was successful or not.
     */
    open(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._panel) {
                return false;
            }
            if (_.isNil(opts)) {
                opts = {};
            }
            let webViewTitle = 'Kanban Board';
            const TITLE = vscode_helpers.toStringSafe(opts.title).trim();
            if ('' !== TITLE) {
                webViewTitle = `${webViewTitle} (${TITLE})`;
            }
            let showOptions = opts.showOptions;
            if (_.isNil(showOptions)) {
                showOptions = vscode.ViewColumn.One;
            }
            let newPanel;
            try {
                this._openOptions = opts;
                newPanel = vscode.window.createWebviewPanel('vscodeKanbanBoard', webViewTitle, showOptions, {
                    enableCommandUris: true,
                    enableFindWidget: true,
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    localResourceRoots: this.getWebViewResourceUris(),
                });
                newPanel.webview.onDidReceiveMessage((msg) => {
                    try {
                        let action;
                        switch (msg.command) {
                            case 'log':
                                action = () => {
                                    if (!_.isNil(msg.data) && !_.isNil(msg.data.message)) {
                                        try {
                                            console.log(JSON.parse(vscode_helpers.toStringSafe(msg.data.message)));
                                        }
                                        catch (e) { }
                                        try {
                                            vsckb.getLogger().debug(JSON.parse(vscode_helpers.toStringSafe(msg.data.message)), 'WebView');
                                        }
                                        catch (e) { }
                                    }
                                };
                                break;
                            case 'onLoaded':
                                action = () => __awaiter(this, void 0, void 0, function* () {
                                    yield this.onLoaded();
                                });
                                break;
                            case 'openExternalUrl':
                                {
                                    const URL_TO_OPEN = vscode_helpers.toStringSafe(msg.data.url);
                                    const URL_TEXT = vscode_helpers.toStringSafe(msg.data.text).trim();
                                    if (!vscode_helpers.isEmptyString(URL_TO_OPEN)) {
                                        action = () => __awaiter(this, void 0, void 0, function* () {
                                            // check if "parsable"
                                            URL.parse(URL_TO_OPEN);
                                            let urlPromptText;
                                            if ('' === URL_TEXT) {
                                                urlPromptText = `'${URL_TO_OPEN}'`;
                                            }
                                            else {
                                                urlPromptText = `'${URL_TEXT}' (${URL_TO_OPEN})`;
                                            }
                                            const SELECTED_ITEM = yield vscode.window.showWarningMessage(`Do you really want to open the URL ${urlPromptText}?`, {
                                                title: 'Yes',
                                                action: () => __awaiter(this, void 0, void 0, function* () {
                                                    yield vsckb.open(URL_TO_OPEN);
                                                })
                                            }, {
                                                title: 'No',
                                                isCloseAffordance: true
                                            });
                                            if (SELECTED_ITEM) {
                                                if (SELECTED_ITEM.action) {
                                                    yield SELECTED_ITEM.action();
                                                }
                                            }
                                        });
                                    }
                                }
                                break;
                            case 'openKnownUrl':
                                const KU = KNOWN_URLS[vscode_helpers.normalizeString(msg.data)];
                                if (!_.isNil(KU)) {
                                    action = () => __awaiter(this, void 0, void 0, function* () {
                                        yield vsckb.open(KU);
                                    });
                                }
                                break;
                            case 'raiseEvent':
                                const EVENT_DATA = msg.data;
                                if (EVENT_DATA) {
                                    action = () => __awaiter(this, void 0, void 0, function* () {
                                        yield this.raiseEvent(vscode_helpers.normalizeString(EVENT_DATA.name), EVENT_DATA.data);
                                    });
                                }
                                break;
                            case 'reloadBoard':
                                action = () => __awaiter(this, void 0, void 0, function* () {
                                    yield this.reloadBoard();
                                });
                                break;
                            case 'saveBoard':
                                action = () => __awaiter(this, void 0, void 0, function* () {
                                    const BOARD_TO_SAVE = msg.data;
                                    if (BOARD_TO_SAVE) {
                                        const LISTENERS = vscode_helpers.asArray(this._saveBoardEventListeners);
                                        for (const L of LISTENERS) {
                                            try {
                                                yield Promise.resolve(L(BOARD_TO_SAVE));
                                            }
                                            catch (e) {
                                                vsckb.showError(e);
                                            }
                                        }
                                    }
                                });
                                break;
                            case 'saveFilter':
                                action = () => __awaiter(this, void 0, void 0, function* () {
                                    const FILTER = vscode_helpers.toStringSafe(msg.data);
                                    const LISTENERS = vscode_helpers.asArray(this._saveBoardFilterEventListeners);
                                    for (const L of LISTENERS) {
                                        try {
                                            yield Promise.resolve(L(FILTER));
                                        }
                                        catch (e) {
                                            vsckb.showError(e);
                                        }
                                    }
                                });
                                break;
                        }
                        if (action) {
                            Promise.resolve(action()).then(() => {
                            }, (err) => {
                                vsckb.showError(err);
                            });
                        }
                    }
                    catch (e) {
                        vsckb.showError(e);
                    }
                });
                newPanel.onDidChangeViewState((e) => {
                    try {
                        if (e.webviewPanel.visible) {
                            (() => __awaiter(this, void 0, void 0, function* () {
                                yield this.postMessage('webviewIsVisible');
                            }))().then(() => {
                            }, () => {
                            });
                        }
                    }
                    catch (_a) { }
                });
                newPanel.webview.html = this.generateHTML();
                this._panel = newPanel;
                return true;
            }
            catch (e) {
                vscode_helpers.tryDispose(newPanel);
                this._openOptions = null;
                throw e;
            }
        });
    }
    /**
     * Gets the options for opening the board.
     */
    get openOptions() {
        return this._openOptions;
    }
    /**
     * Gets the underlying panel.
     */
    get panel() {
        return this._panel;
    }
    /**
     * @inheritdoc
     */
    postMessage(command, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const MSG = {
                command: command,
                data: data,
            };
            return yield this.view.postMessage(MSG);
        });
    }
    raiseEvent(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const LISTENER = this.openOptions.raiseEvent;
            if (!LISTENER) {
                return;
            }
            const CTX = {
                data: data,
                name: vscode_helpers.normalizeString(name),
                postMessage: (cmd, d) => __awaiter(this, void 0, void 0, function* () {
                    return this.postMessage(vscode_helpers.toStringSafe(cmd), d);
                })
            };
            yield Promise.resolve(LISTENER(CTX));
        });
    }
    reloadBoard() {
        return __awaiter(this, void 0, void 0, function* () {
            const FILE = this.file;
            if (!FILE) {
                return;
            }
            let loadedBoard = JSON.parse(yield FSExtra.readFile(FILE.fsPath, 'utf8'));
            if (_.isNil(loadedBoard)) {
                loadedBoard = newBoard();
            }
            loadedBoard = vscode_helpers.cloneObject(loadedBoard);
            {
                const SET_CARD_CONTENT = (card, property) => {
                    let cardContentValue = card[property];
                    let cardContent;
                    if (!_.isNil(cardContentValue)) {
                        if (_.isObject(cardContentValue)) {
                            cardContent = cardContentValue;
                        }
                        else {
                            cardContent = {
                                content: vscode_helpers.toStringSafe(cardContentValue),
                                mime: 'text/plain',
                            };
                        }
                        if (vscode_helpers.isEmptyString(cardContent.content)) {
                            cardContent = undefined;
                        }
                    }
                    if (!_.isNil(cardContent)) {
                        const MIME = vscode_helpers.normalizeString(cardContent.mime);
                        switch (MIME) {
                            case 'text/markdown':
                                cardContent.mime = MIME;
                                break;
                            default:
                                cardContent.mime = 'text/plain';
                                break;
                        }
                    }
                    card[property] = cardContent;
                };
                const FIND_NEXT_SIMPLE_CARD_ID = () => {
                    let lastID = 0;
                    for (const BC of exports.BOARD_COLMNS) {
                        const CARDS = vscode_helpers.asArray(loadedBoard[BC]);
                        for (const C of CARDS) {
                            if (!vscode_helpers.isEmptyString(C.id)) {
                                const CARD_ID_NUM = parseInt(vscode_helpers.toStringSafe(C.id).trim());
                                if (!isNaN(CARD_ID_NUM)) {
                                    lastID = Math.max(lastID, CARD_ID_NUM);
                                }
                            }
                        }
                    }
                    return lastID + 1;
                };
                for (const BC of exports.BOARD_COLMNS) {
                    const CARDS = loadedBoard[BC]
                        = vscode_helpers.asArray(loadedBoard[BC]);
                    for (const C of CARDS) {
                        if (vscode_helpers.isEmptyString(C.id)) {
                            let prefix = '';
                            try {
                                if (!vscode_helpers.isEmptyString(C.creation_time)) {
                                    const CREATION_TIME = vscode_helpers.asUTC(C.creation_time);
                                    if (CREATION_TIME.isValid()) {
                                        prefix += CREATION_TIME.format('YYYYMMDDHHmmss') + '_';
                                    }
                                }
                            }
                            catch (_a) { }
                            prefix += Math.floor(Math.random() * 597923979) + '_';
                            let simpleIDs;
                            if (this.openOptions.settings) {
                                simpleIDs = this.openOptions.settings.simpleIDs;
                            }
                            if (vscode_helpers.toBooleanSafe(simpleIDs, true)) {
                                C.id = '' + FIND_NEXT_SIMPLE_CARD_ID();
                            }
                            else {
                                C.id = `${prefix}${vscode_helpers.uuid().split('-').join('')}`;
                            }
                        }
                        SET_CARD_CONTENT(C, 'description');
                        SET_CARD_CONTENT(C, 'details');
                    }
                }
            }
            let filter;
            try {
                const LOAD_FILTER = this.openOptions.loadFilter;
                if (LOAD_FILTER) {
                    filter = yield Promise.resolve(LOAD_FILTER());
                }
            }
            catch (e) {
                vsckb.showError(e);
            }
            yield this.postMessage('setBoard', {
                cards: loadedBoard,
                filter: vscode_helpers.toStringSafe(filter),
                settings: this.openOptions.settings,
            });
        });
    }
    /**
     * Gets the underlying web view.
     */
    get view() {
        return this.panel.webview;
    }
}
exports.KanbanBoard = KanbanBoard;
/**
 * Creates a new board object.
 *
 * @return {Board} The new object.
 */
function newBoard() {
    return {
        'todo': [],
        'in-progress': [],
        'testing': [],
        'done': [],
    };
}
exports.newBoard = newBoard;
/**
 * Opens a kanban board.
 *
 * @param {OpenBoardOptions} [opts] The options.
 *
 * @return {Promise<KanbanBoard>} The promise with the new board.
 */
function openBoard(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const NEW_BOARD = new KanbanBoard();
        yield NEW_BOARD.initialize();
        if (opts.saveBoard) {
            NEW_BOARD.onSaveBoard(opts.saveBoard);
        }
        if (opts.saveFilter) {
            NEW_BOARD.onSaveBoardFilter(opts.saveFilter);
        }
        yield NEW_BOARD.open(opts);
        return NEW_BOARD;
    });
}
exports.openBoard = openBoard;
//# sourceMappingURL=boards.js.map