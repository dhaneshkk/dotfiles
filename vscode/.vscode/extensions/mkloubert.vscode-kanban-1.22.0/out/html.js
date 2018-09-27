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
Object.defineProperty(exports, "__esModule", { value: true });
const HtmlEntities = require("html-entities");
const vscode_helpers = require("vscode-helpers");
/**
 * Generates the common content for footer.
 *
 * @param {GenerateFooterOptions} opts Options.
 *
 * @return {string} The generated HTML code.
 */
function generateFooter(opts) {
    return `
    <div id="vsckb-body-bottom" class="clearfix"></div>

    <link rel="stylesheet" href="${opts.getResourceUri('css/style.css')}">
    <link rel="stylesheet" href="${opts.getResourceUri('css/' + opts.styleFile + '.css')}" vsckb-style="custom">

    <script src="${opts.getResourceUri('js/script.js')}" crossorigin="anonymous"></script>
    <script src="${opts.getResourceUri('js/' + opts.scriptFile + '.js')}" crossorigin="anonymous"></script>

${opts.getFooter ? opts.getFooter() : ''}

  </body>
</html>`;
}
exports.generateFooter = generateFooter;
/**
 * Generates the common content for 'head' tag.
 *
 * @param {GenerateHeaderOptions} opts Options.
 *
 * @return {string} The generated HTML code.
 */
function generateHeader(opts) {
    const AJAX_LOADER_16x11 = `${opts.getResourceUri('img/ajax-loader-16x11.gif')}`;
    const HTML_ENCODER = new HtmlEntities.AllHtmlEntities();
    const DOC_TITLE = getDocumentTitle(opts.title);
    return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">

        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <link rel="stylesheet" href="${opts.getResourceUri('css/font-awesome.css')}">
        <link rel="stylesheet" href="${opts.getResourceUri('css/hljs-atom-one-dark.css')}">
        <link rel="stylesheet" href="${opts.getResourceUri('css/codemirror.css')}">
        <link rel="stylesheet" href="${opts.getResourceUri('css/mermaid/mermaid.css')}">
        <link rel="stylesheet" href="${opts.getResourceUri('css/mermaid/mermaid.dark.css')}">
        <link rel="stylesheet" href="${opts.getResourceUri('css/bootstrap.min.css')}" vsckb-style="bootstrap">

        <script src="${opts.getResourceUri('js/filtrex.js')}"></script>
        <script src="${opts.getResourceUri('js/moment-with-locales.min.js')}"></script>
        <script src="${opts.getResourceUri('js/highlight.pack.js')}"></script>
        <script src="${opts.getResourceUri('js/codemirror/codemirror.js')}"></script>
        <script src="${opts.getResourceUri('js/codemirror/addon/display/autorefresh.js')}"></script>
        <script src="${opts.getResourceUri('js/codemirror/mode/markdown/markdown.js')}"></script>
        <script src="${opts.getResourceUri('js/mermaid/mermaid.js')}"></script>
        <script src="${opts.getResourceUri('js/mermaid/mermaidAPI.js')}"></script>
        <script src="${opts.getResourceUri('js/showdown.min.js')}"></script>
        <script src="${opts.getResourceUri('js/jquery.min.js')}" crossorigin="anonymous"></script>
        <script src="${opts.getResourceUri('js/bootstrap.bundle.min.js')}" crossorigin="anonymous"></script>

        <script>
            const vscode = acquireVsCodeApi();

            function vsckb_log(msg) {
                try {
                    if (msg instanceof Error) {
                        msg = \`ERROR: \${ msg.message }

    \${ msg.stack }\`;
                    }

                    vscode.postMessage({
                        command: 'log',
                        data: {
                            message: JSON.stringify(msg)
                        }
                    });
                } catch (e) { }
            }

            window.onerror = function(message, url, line, column, error) {
                vsckb_log({
                    message: message,
                    url: url,
                    line: line,
                    column: column,
                    error: error
                });

                return false;
            };

            const VSCKB_AJAX_LOADER_16x11 = ${JSON.stringify(AJAX_LOADER_16x11)};
        </script>

        <title>${HTML_ENCODER.encode(DOC_TITLE)}</title>
    </head>
    <body>
        <div id="vsckb-body-top" class="clearfix"></div>
`;
}
exports.generateHeader = generateHeader;
/**
 * Generates a full HTML document.
 *
 * @param {GenerateHtmlDocumentOptions} opts Options.
 *
 * @return {string} The generated HTML code.
 */
function generateHtmlDocument(opts) {
    return `${generateHeader({
        getResourceUri: opts.getResourceUri,
        title: opts.title,
    })}

${generateNavBarHeader({
        getHeaderButtons: opts.getHeaderButtons,
        getResourceUri: opts.getResourceUri,
        title: opts.title,
    })}

${opts.getContent ? opts.getContent() : ''}

${generateFooter({
        getFooter: opts.getFooter,
        getResourceUri: opts.getResourceUri,
        scriptFile: opts.name,
        styleFile: opts.name,
    })}`;
}
exports.generateHtmlDocument = generateHtmlDocument;
/**
 * Generates the common HTML for a header navbar.
 *
 * @param {GenerateNavBarHeaderOptions} opts Options.
 *
 * @return {string} The generated HTML code.
 */
function generateNavBarHeader(opts) {
    const HTML_ENCODER = new HtmlEntities.AllHtmlEntities();
    const DOC_TITLE = getDocumentTitle(opts.title);
    return `
<header>
    <nav class="navbar navbar-dark fixed-top bg-dark">
        <a class="navbar-brand" href="#">
            <img src="${opts.getResourceUri('img/icon.svg')}" width="30" height="30" class="d-inline-block align-top" alt="">
            <span>${HTML_ENCODER.encode(DOC_TITLE)}</span>
        </a>

        <form class="form-inline">
            ${opts.getHeaderButtons ? opts.getHeaderButtons() : ''}

            <div id="vsckb-social-media-btns">
                <a class="btn btn-dark btn-sm text-white vsckb-btn-with-known-url" vsckb-url="github" title="Open Project On GitHub">
                    <i class="fa fa-github" aria-hidden="true"></i>
                </a>

                <a class="btn btn-dark btn-sm text-white vsckb-btn-with-known-url" vsckb-url="twitter" title="Follow Author On Twitter">
                    <i class="fa fa-twitter" aria-hidden="true"></i>
                </a>

                <a class="btn btn-dark btn-sm text-white vsckb-btn-with-known-url" vsckb-url="paypal" title="Support Project via PayPal">
                    <i class="fa fa-paypal" aria-hidden="true"></i>
                </a>
            </div>
        </form>
    </nav>
</header>
`;
}
exports.generateNavBarHeader = generateNavBarHeader;
function getDocumentTitle(title) {
    title = vscode_helpers.toStringSafe(title).trim();
    let docTitle = 'Kanban Board';
    if ('' !== title) {
        docTitle = `${docTitle} (${title})`;
    }
    return docTitle;
}
//# sourceMappingURL=html.js.map