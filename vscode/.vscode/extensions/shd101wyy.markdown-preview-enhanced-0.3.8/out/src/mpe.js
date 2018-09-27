"use strict";
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
 * The core of markdown preview enhanced package.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const utility = require("./utility");
let INITIALIZED = false;
let CONFIG_CHANGE_CALLBACK = null;
/**
 * style.less, mathjax_config.js, and mermaid_config.js files
 */
exports.extensionConfig = {
    globalStyle: "",
    mathjaxConfig: null,
    mermaidConfig: "MERMAID_CONFIG = {startOnLoad: false}",
    phantomjsConfig: {}
};
/**
 * init markdown-preview-enhanced config folder at ~/.markdown-preview-enhanced
 */
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        if (INITIALIZED)
            return;
        const homeDir = os.homedir();
        const extensionConfigDirectoryPath = path.resolve(homeDir, './.markdown-preview-enhanced');
        if (!fs.existsSync(extensionConfigDirectoryPath)) {
            fs.mkdirSync(extensionConfigDirectoryPath);
        }
        exports.extensionConfig.globalStyle = yield utility.getGlobalStyles();
        exports.extensionConfig.mermaidConfig = yield utility.getMermaidConfig();
        exports.extensionConfig.mathjaxConfig = yield utility.getMathJaxConfig();
        exports.extensionConfig.phantomjsConfig = yield utility.getPhantomjsConfig();
        fs.watch(extensionConfigDirectoryPath, (eventType, fileName) => {
            if (eventType === 'change' && CONFIG_CHANGE_CALLBACK) {
                if (fileName === 'style.less') {
                    utility.getGlobalStyles()
                        .then((css) => {
                        exports.extensionConfig.globalStyle = css;
                        CONFIG_CHANGE_CALLBACK();
                    });
                }
                else if (fileName === 'mermaid_config.js') {
                    utility.getMermaidConfig()
                        .then((mermaidConfig) => {
                        exports.extensionConfig.mermaidConfig = mermaidConfig;
                        CONFIG_CHANGE_CALLBACK();
                    });
                }
                else if (fileName === 'mathjax_config.js') {
                    utility.getMathJaxConfig()
                        .then((mathjaxConfig) => {
                        exports.extensionConfig.mathjaxConfig = mathjaxConfig;
                        CONFIG_CHANGE_CALLBACK();
                    });
                }
            }
        });
        INITIALIZED = true;
        return;
    });
}
exports.init = init;
/**
 * cb will be called when global style.less file is changed.
 * @param cb function(error, css){}
 */
function onDidChangeConfigFile(cb) {
    CONFIG_CHANGE_CALLBACK = cb;
}
exports.onDidChangeConfigFile = onDidChangeConfigFile;
//# sourceMappingURL=mpe.js.map