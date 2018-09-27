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
const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");
const request = require("request");
const child_process_1 = require("child_process");
const matter = require('gray-matter');
const plantumlAPI = require("./puml");
const utility_1 = require("./utility");
const utility = require("./utility");
const extension_helper_1 = require("./extension-helper");
const transformer_1 = require("./transformer");
const toc_1 = require("./toc");
const prince_convert_1 = require("./prince-convert");
const ebook_convert_1 = require("./ebook-convert");
const pandoc_convert_1 = require("./pandoc-convert");
const markdown_convert_1 = require("./markdown-convert");
const CodeChunkAPI = require("./code-chunk");
const extensionDirectoryPath = utility.extensionDirectoryPath;
const katex = require(path.resolve(extensionDirectoryPath, './dependencies/katex/katex.min.js'));
const remarkable = require(path.resolve(extensionDirectoryPath, './dependencies/remarkable/remarkable.js'));
const jsonic = require(path.resolve(extensionDirectoryPath, './dependencies/jsonic/jsonic.js'));
const md5 = require(path.resolve(extensionDirectoryPath, './dependencies/javascript-md5/md5.js'));
const CryptoJS = require(path.resolve(extensionDirectoryPath, './dependencies/crypto-js/crypto-js.js'));
const Viz = require(path.resolve(extensionDirectoryPath, './dependencies/viz/viz.js'));
const pdf = require(path.resolve(extensionDirectoryPath, './dependencies/node-html-pdf/index.js'));
// import * as Prism from "prismjs"
let Prism = null;
const defaults = {
    html: true,
    xhtmlOut: false,
    breaks: true,
    langPrefix: 'language-',
    linkify: true,
    linkTarget: '',
    typographer: true,
};
let MODIFY_SOURCE = null;
class MarkdownEngine {
    // private cachedInputString:string = '' // <= this is wrong
    constructor(args) {
        // caches 
        this.graphsCache = {};
        // code chunks 
        this.codeChunksData = {};
        // files cache 
        this.filesCache = {};
        /**
         * cachedHTML is the cache of html generated from the markdown file.
         */
        this.cachedHTML = '';
        this.filePath = args.filePath;
        this.fileDirectoryPath = path.dirname(this.filePath);
        this.projectDirectoryPath = args.projectDirectoryPath || '/';
        this.config = args.config;
        this.initConfig();
        this.headings = [];
        this.tocHTML = '';
        this.md = new remarkable('full', Object.assign({}, defaults, { typographer: this.enableTypographer, breaks: this.breakOnSingleNewLine }));
        this.configureRemarkable();
    }
    /**
     * Modify markdown source, append `result` after corresponding code chunk.
     * @param codeChunkData
     * @param result
     */
    static modifySource(codeChunkData, result, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (MODIFY_SOURCE) {
                yield MODIFY_SOURCE(codeChunkData, result, filePath);
            }
            else {
                // TODO: direcly modify the local file.
            }
            codeChunkData.running = false;
            return result;
        });
    }
    /**
     * Bind cb to MODIFY_SOURCE
     * @param cb
     */
    static onModifySource(cb) {
        MODIFY_SOURCE = cb;
    }
    initConfig() {
        this.breakOnSingleNewLine = this.config.breakOnSingleNewLine;
        this.enableTypographer = this.config.enableTypographer;
        // protocal whitelist
        const protocolsWhiteList = this.config.protocolsWhiteList.split(',').map((x) => x.trim()) || ['http', 'https', 'atom', 'file'];
        this.protocolsWhiteListRegExp = new RegExp('^(' + protocolsWhiteList.join('|') + ')\:\/\/'); // eg /^(http|https|atom|file)\:\/\//
        this.config.printBackground = this.config.printBackground || false;
        this.config.phantomPath = this.config.phantomPath || 'phantomjs';
        this.config.pandocPath = this.config.pandocPath || 'pandoc';
        this.config.pandocArguments = this.config.pandocArguments || [];
        this.config.pandocMarkdownFlavor = this.config.pandocMarkdownFlavor || 'markdown-raw_tex+tex_math_single_backslash';
    }
    updateConfiguration(config) {
        this.config = Object.assign({}, this.config, config);
        this.initConfig();
        this.md.set({ breaks: this.breakOnSingleNewLine, typographer: this.enableTypographer });
    }
    cacheSVG(code, svg) {
        svg = CryptoJS.AES.decrypt(svg, 'markdown-preview-enhanced').toString(CryptoJS.enc.Utf8);
        // const base64 = new Buffer(svg).toString('base64')
        // const img = `<img src="data:image/svg+xml;charset=utf-8;base64,${base64}">`
        this.graphsCache[md5(code)] = svg;
    }
    cacheCodeChunkResult(id, result) {
        const codeChunkData = this.codeChunksData[id];
        if (!codeChunkData)
            return;
        codeChunkData.result = CryptoJS.AES.decrypt(result, 'markdown-preview-enhanced').toString(CryptoJS.enc.Utf8);
    }
    /**
     *
     * @param content the math expression
     * @param openTag the open tag, eg: '\('
     * @param closeTag the close tag, eg: '\)'
     * @param displayMode whether to be rendered in display mode
     */
    parseMath({ content, openTag, closeTag, displayMode }) {
        if (!content)
            return '';
        if (this.config.mathRenderingOption[0] == 'K') {
            try {
                return katex.renderToString(content, { displayMode });
            }
            catch (error) {
                return `<span style=\"color: #ee7f49; font-weight: 500;\">${error.toString()}</span>`;
            }
        }
        else if (this.config.mathRenderingOption[0] == 'M') {
            const text = (openTag + content + closeTag).replace(/\n/g, '');
            const tag = displayMode ? 'div' : 'span';
            return `<${tag} class="mathjax-exps">${utility_1.escapeString(text)}</${tag}>`;
        }
        else {
            return '';
        }
    }
    configureRemarkable() {
        /**
         * math rule
         */
        this.md.inline.ruler.before('escape', 'math', (state, silent) => {
            if (this.config.mathRenderingOption[0] == 'N')
                return false;
            let openTag = null, closeTag = null, displayMode = true, inline = this.config.mathInlineDelimiters, block = this.config.mathBlockDelimiters;
            for (let a = 0; a < block.length; a++) {
                const b = block[a];
                if (state.src.startsWith(b[0], state.pos)) {
                    openTag = b[0];
                    closeTag = b[1];
                    displayMode = true;
                    break;
                }
            }
            if (!openTag) {
                for (let a = 0; a < inline.length; a++) {
                    const i = inline[a];
                    if (state.src.startsWith(i[0], state.pos)) {
                        openTag = i[0];
                        closeTag = i[1];
                        displayMode = false;
                        break;
                    }
                }
            }
            if (!openTag)
                return false; // not math
            let content = null, end = -1;
            let i = state.pos + openTag.length;
            while (i < state.src.length) {
                if (state.src.startsWith(closeTag, i)) {
                    end = i;
                    break;
                }
                else if (state.src[i] == '\\') {
                    i += 1;
                }
                i += 1;
            }
            if (end >= 0)
                content = state.src.slice(state.pos + openTag.length, end);
            else
                return false;
            if (content && !silent) {
                state.push({
                    type: 'math',
                    content: content.trim(),
                    openTag: openTag,
                    closeTag: closeTag,
                    displayMode: displayMode
                });
                state.pos += (content.length + openTag.length + closeTag.length);
                return true;
            }
            else {
                return false;
            }
        });
        /**
         * math renderer
         */
        this.md.renderer.rules.math = (tokens, idx) => {
            return this.parseMath(tokens[idx] || {});
        };
        /**
         * wikilink rule
         * inline [[]]
         * [[...]]
         */
        this.md.inline.ruler.before('autolink', 'wikilink', (state, silent) => {
            if (!this.config.enableWikiLinkSyntax || !state.src.startsWith('[[', state.pos))
                return false;
            let content = null, tag = ']]', end = -1;
            let i = state.pos + tag.length;
            while (i < state.src.length) {
                if (state.src[i] == '\\') {
                    i += 1;
                }
                else if (state.src.startsWith(tag, i)) {
                    end = i;
                    break;
                }
                i += 1;
            }
            if (end >= 0)
                content = state.src.slice(state.pos + tag.length, end);
            else
                return false;
            if (content && !silent) {
                state.push({
                    type: 'wikilink',
                    content: content
                });
                state.pos += content.length + 2 * tag.length;
                return true;
            }
            else {
                return false;
            }
        });
        this.md.renderer.rules.wikilink = (tokens, idx) => {
            let { content } = tokens[idx];
            if (!content)
                return;
            let splits = content.split('|');
            let linkText = splits[0].trim();
            let wikiLink = splits.length === 2 ? `${splits[1].trim()}${this.config.wikiLinkFileExtension}` : `${linkText.replace(/\s/g, '')}${this.config.wikiLinkFileExtension}`;
            return `<a href="${wikiLink}">${linkText}</a>`;
        };
        // task list 
        this.md.renderer.rules.list_item_open = (tokens, idx) => {
            if (tokens[idx + 2]) {
                let children = tokens[idx + 2].children;
                if (!children || !(children[0] && children[0].content))
                    return '<li>';
                const line = children[0].content;
                if (line.match(/^\[[xX\s]\]\s/)) {
                    children[0].content = line.slice(3);
                    let checked = !(line[1] == ' ');
                    let checkBox = `<input type=\"checkbox\" class=\"task-list-item-checkbox\" ${checked ? 'checked' : ''}>`;
                    let level = children[0].level;
                    children = [{ content: checkBox, type: 'htmltag', level }].concat(children);
                    tokens[idx + 2].children = children;
                    return '<li class="task-list-item">';
                }
                return '<li>';
            }
            else {
                return '<li>';
            }
        };
        // code fences 
        // modified to support math block
        // check https://github.com/jonschlinkert/remarkable/blob/875554aedb84c9dd190de8d0b86c65d2572eadd5/lib/rules.js
        this.md.renderer.rules.fence = (tokens, idx, options, env, instance) => {
            let token = tokens[idx], langClass = '', langPrefix = options.langPrefix, langName = utility_1.escapeString(token.params);
            if (token.params)
                langClass = ' class="' + langPrefix + langName + '" ';
            // get code content
            let content = utility_1.escapeString(token.content);
            // copied from getBreak function.
            let break_ = '\n';
            if (idx < tokens.length && tokens[idx].type === 'list_item_close')
                break_ = '';
            if (langName === 'math') {
                const openTag = this.config.mathBlockDelimiters[0][0] || '$$';
                const closeTag = this.config.mathBlockDelimiters[0][1] || '$$';
                const mathExp = utility_1.unescapeString(content).trim();
                if (!mathExp)
                    return '';
                const mathHtml = this.parseMath({ openTag, closeTag, content: mathExp, displayMode: true });
                return `<p>${mathHtml}</p>`;
            }
            return '<pre><code' + langClass + '>' + content + '</code></pre>' + break_;
        };
    }
    /**
     * Embed local images. Load the image file and display it in base64 format
     */
    embedLocalImages($) {
        return __awaiter(this, void 0, void 0, function* () {
            const asyncFunctions = [];
            $('img').each((i, img) => {
                const $img = $(img);
                let src = this.resolveFilePath($img.attr('src'), false);
                let fileProtocalMatch;
                if (fileProtocalMatch = src.match(/^file:\/\/+/)) {
                    src = src.replace(fileProtocalMatch[0], '/');
                    src = src.replace(/\?(\.|\d)+$/, ''); // remove cache
                    const imageType = path.extname(src).slice(1);
                    if (imageType === 'svg')
                        return;
                    asyncFunctions.push(new Promise((resolve, reject) => {
                        fs.readFile(decodeURI(src), (error, data) => {
                            if (error)
                                return resolve(null);
                            const base64 = new Buffer(data).toString('base64');
                            $img.attr('src', `data:image/${imageType};charset=utf-8;base64,${base64}`);
                            return resolve(base64);
                        });
                    }));
                }
            });
            yield Promise.all(asyncFunctions);
            return $;
        });
    }
    /**
     * Load local svg files and embed them into html directly.
     * @param $
     */
    embedSVG($) {
        return __awaiter(this, void 0, void 0, function* () {
            const asyncFunctions = [];
            $('img').each((i, img) => {
                const $img = $(img);
                let src = this.resolveFilePath($img.attr('src'), false);
                let fileProtocalMatch;
                if (fileProtocalMatch = src.match(/^file:\/\/+/)) {
                    src = src.replace(fileProtocalMatch[0], '/');
                    src = src.replace(/\?(\.|\d)+$/, ''); // remove cache
                    const imageType = path.extname(src).slice(1);
                    if (imageType !== 'svg')
                        return;
                    asyncFunctions.push(new Promise((resolve, reject) => {
                        fs.readFile(decodeURI(src), (error, data) => {
                            if (error)
                                return resolve(null);
                            const base64 = new Buffer(data).toString('base64');
                            $img.attr('src', `data:image/svg+xml;charset=utf-8;base64,${base64}`);
                            return resolve(base64);
                        });
                    }));
                }
            });
            yield Promise.all(asyncFunctions);
            return $;
        });
    }
    /**
     * Generate HTML content
     * @param html: this is the final content you want to put.
     * @param yamlConfig: this is the front matter.
     * @param option: HTMLTemplateOption
     */
    generateHTMLFromTemplate(html, yamlConfig = {}, options) {
        return __awaiter(this, void 0, void 0, function* () {
            // get `id` and `class`
            const elementId = yamlConfig['id'] || '';
            let elementClass = yamlConfig['class'] || [];
            if (typeof (elementClass) == 'string')
                elementClass = [elementClass];
            elementClass = elementClass.join(' ');
            // math style and script
            let mathStyle = '';
            if (this.config.mathRenderingOption === 'MathJax') {
                const inline = this.config.mathInlineDelimiters;
                const block = this.config.mathBlockDelimiters;
                // TODO
                const mathJaxConfig = yield utility.getMathJaxConfig();
                mathJaxConfig['tex2jax']['inlineMath'] = this.config.mathInlineDelimiters;
                mathJaxConfig['tex2jax']['displayMath'] = this.config.mathBlockDelimiters;
                if (options.offline) {
                    mathStyle = `
        <script type="text/x-mathjax-config">
          MathJax.Hub.Config(${JSON.stringify(mathJaxConfig)});
        </script>
        <script type="text/javascript" async src="file:///${path.resolve(extensionDirectoryPath, './dependencies/mathjax/MathJax.js')}"></script>
        `;
                }
                else {
                    mathStyle = `
        <script type="text/x-mathjax-config">
          MathJax.Hub.Config(${JSON.stringify(mathJaxConfig)});
        </script>
        <script type="text/javascript" async src="https://cdn.rawgit.com/mathjax/MathJax/2.7.1/MathJax.js"></script>
        `;
                }
            }
            else if (this.config.mathRenderingOption == 'KaTeX') {
                if (options.offline) {
                    mathStyle = `<link rel="stylesheet" href="file:///${path.resolve(extensionDirectoryPath, './dependencies/katex/katex.min.css')}">`;
                }
                else {
                    mathStyle = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css">`;
                }
            }
            else {
                mathStyle = '';
            }
            // mermaid 
            let mermaidScript = '';
            let mermaidStyle = '';
            if (html.indexOf('<div class="mermaid">') >= 0) {
                if (options.offline) {
                    mermaidScript = `<script type="text/javascript" src="file:///${path.resolve(extensionDirectoryPath, './dependencies/mermaid/mermaid.min.js')}"></script>`;
                    mermaidStyle = `<link rel="stylesheet" href="file:///${path.resolve(extensionDirectoryPath, `./dependencies/mermaid/${this.config.mermaidTheme}`)}">`;
                }
                else {
                    mermaidScript = `<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/7.0.0/mermaid.min.js"></script>`;
                    mermaidStyle = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mermaid/7.0.0/${this.config.mermaidTheme.replace('.css', '.min.css')}">`;
                }
                let mermaidConfig = yield utility.getMermaidConfig();
                mermaidScript += `<script>
${mermaidConfig}
window['MERMAID_CONFIG'].startOnLoad = true
mermaidAPI.initialize(window['MERMAID_CONFIG'] || {})
</script>`;
            }
            // presentation
            let presentationScript = '', presentationStyle = '', presentationInitScript = '';
            if (yamlConfig["isPresentationMode"]) {
                if (options.offline) {
                    presentationScript = `
        <script src='file:///${path.resolve(extensionDirectoryPath, './dependencies/reveal/lib/js/head.min.js')}'></script>
        <script src='file:///${path.resolve(extensionDirectoryPath, './dependencies/reveal/js/reveal.js')}'></script>`;
                }
                else {
                    presentationScript = `
        <script src='https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.4.1/lib/js/head.min.js'></script>
        <script src='https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.4.1/js/reveal.min.js'></script>`;
                }
                let presentationConfig = yamlConfig['presentation'] || {};
                let dependencies = presentationConfig['dependencies'] || [];
                if (presentationConfig['enableSpeakerNotes']) {
                    if (options.offline)
                        dependencies.push({ src: path.resolve(extensionDirectoryPath, './dependencies/reveal/plugin/notes/notes.js'), async: true });
                    else
                        dependencies.push({ src: 'revealjs_deps/notes.js', async: true }); // TODO: copy notes.js file to corresponding folder
                }
                presentationConfig['dependencies'] = dependencies;
                presentationStyle = `
      <style>
      ${fs.readFileSync(path.resolve(extensionDirectoryPath, './dependencies/reveal/reveal.css'))}
      ${options.isForPrint ? fs.readFileSync(path.resolve(extensionDirectoryPath, './dependencies/reveal/pdf.css')) : ''}
      </style>
      `;
                presentationInitScript = `
      <script>
        Reveal.initialize(${JSON.stringify(Object.assign({ margin: 0.1 }, presentationConfig))})
      </script>
      `;
            }
            // prince 
            let princeClass = "";
            if (options.isForPrince) {
                princeClass = "prince";
            }
            // phantomjs 
            let phantomjsClass = "";
            if (options.phantomjsType) {
                if (options.phantomjsType === 'pdf') {
                    phantomjsClass = 'phantomjs-pdf';
                }
                else {
                    phantomjsClass = 'phantomjs-image';
                }
            }
            let title = path.basename(this.filePath);
            title = title.slice(0, title.length - path.extname(title).length); // remove '.md'
            // prism and preview theme 
            let styleCSS = "";
            try {
                const styles = yield Promise.all([
                    // prism *.css
                    utility.readFile(path.resolve(extensionDirectoryPath, `./dependencies/prism/themes/${this.config.codeBlockTheme}`), { encoding: 'utf-8' }),
                    // preview theme
                    (options.isForPrint && !this.config.printBackground) ?
                        utility.readFile(path.resolve(extensionDirectoryPath, `./styles/github-light.css`), { encoding: 'utf-8' }) :
                        utility.readFile(path.resolve(extensionDirectoryPath, `./styles/${this.config.previewTheme}`), { encoding: 'utf-8' }),
                    // style template
                    utility.readFile(path.resolve(extensionDirectoryPath, './styles/style-template.css'), { encoding: 'utf-8' })
                ]);
                styleCSS = styles.join('');
            }
            catch (e) {
                styleCSS = '';
            }
            // global styles 
            let globalStyles = "";
            try {
                globalStyles = yield utility.getGlobalStyles();
            }
            catch (error) {
                // ignore it 
            }
            html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${presentationStyle}
      ${mathStyle}
      ${mermaidStyle}

      ${presentationScript}
      ${mermaidScript}

      <style> 
      ${styleCSS} 
      ${globalStyles} 
      </style>
    </head>
    <body class="markdown-preview-enhanced ${princeClass} ${phantomjsClass} ${elementClass}" ${yamlConfig["isPresentationMode"] ? 'data-presentation-mode' : ''} ${elementId ? `id="${elementId}"` : ''}>
    ${html}
    </body>
    ${presentationInitScript}
  </html>
    `;
            if (options.embedLocalImages) {
                let $ = cheerio.load(html, { xmlMode: true });
                $ = yield this.embedLocalImages($);
                html = $.html();
            }
            if (options.embedSVG) {
                let $ = cheerio.load(html, { xmlMode: true });
                $ = yield this.embedSVG($);
                html = $.html();
            }
            return html;
        });
    }
    /**
     * generate HTML file and open it in browser
     */
    openInBrowser() {
        return __awaiter(this, void 0, void 0, function* () {
            const inputString = yield utility.readFile(this.filePath, { encoding: 'utf-8' });
            let { html, yamlConfig } = yield this.parseMD(inputString, { useRelativeFilePath: false, hideFrontMatter: true, isForPreview: false });
            html = yield this.generateHTMLFromTemplate(html, yamlConfig, { isForPrint: false, isForPrince: false, offline: true, embedLocalImages: false });
            // create temp file
            const info = yield utility.tempOpen({
                prefix: 'markdown-preview-enhanced',
                suffix: '.html'
            });
            yield utility.write(info.fd, html);
            // open in browser
            utility.openFile(info.path);
            return;
        });
    }
    /**
     *
     * @param filePath
     * @return dest if success, error if failure
     */
    saveAsHTML(offline) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputString = yield utility.readFile(this.filePath, { encoding: 'utf-8' });
            let { html, yamlConfig } = yield this.parseMD(inputString, { useRelativeFilePath: true, hideFrontMatter: true, isForPreview: false });
            const htmlConfig = yamlConfig['html'] || {};
            if ('cdn' in htmlConfig) {
                offline = !htmlConfig['cdn'];
            }
            let embedLocalImages = htmlConfig['embed_local_images'];
            let dest = this.filePath;
            let extname = path.extname(dest);
            dest = dest.replace(new RegExp(extname + '$'), '.html');
            html = yield this.generateHTMLFromTemplate(html, yamlConfig, {
                isForPrint: false,
                isForPrince: false,
                embedLocalImages: embedLocalImages,
                offline: offline,
                embedSVG: true
            });
            const htmlFileName = path.basename(dest);
            // presentation speaker notes
            // copy dependency files
            if (!offline && html.indexOf('[{"src":"revealjs_deps/notes.js","async":true}]') >= 0) {
                const depsDirName = path.resolve(path.dirname(dest), 'revealjs_deps');
                if (!fs.existsSync(depsDirName)) {
                    fs.mkdirSync(depsDirName);
                }
                fs.createReadStream(path.resolve(extensionDirectoryPath, './dependencies/reveal/plugin/notes/notes.js')).pipe(fs.createWriteStream(path.resolve(depsDirName, 'notes.js')));
                fs.createReadStream(path.resolve(extensionDirectoryPath, './dependencies/reveal/plugin/notes/notes.html')).pipe(fs.createWriteStream(path.resolve(depsDirName, 'notes.html')));
            }
            yield utility.writeFile(dest, html);
            return dest;
        });
    }
    /**
     * Phantomjs file export
     * The config could be set by front-matter.
     * Check https://github.com/marcbachmann/node-html-pdf website.
     * @param type the export file type
     */
    phantomjsExport(type = "pdf") {
        return __awaiter(this, void 0, void 0, function* () {
            const inputString = yield utility.readFile(this.filePath, { encoding: 'utf-8' });
            let { html, yamlConfig } = yield this.parseMD(inputString, { useRelativeFilePath: false, hideFrontMatter: true, isForPreview: false });
            let dest = this.filePath;
            let extname = path.extname(dest);
            dest = dest.replace(new RegExp(extname + '$'), '.' + type);
            html = yield this.generateHTMLFromTemplate(html, yamlConfig, {
                isForPrint: true,
                isForPrince: false,
                embedLocalImages: false,
                offline: true,
                phantomjsType: type
            });
            const phantomjsConfig = Object.assign({
                type: type,
                border: '1cm',
                quality: '75',
                script: path.join(extensionDirectoryPath, './dependencies/phantomjs/pdf_a4_portrait.js')
            }, yield utility.getPhantomjsConfig(), yamlConfig['phantomjs'] || yamlConfig['phantom'] || {});
            if (!phantomjsConfig['phantomPath']) {
                phantomjsConfig['phantomPath'] = this.config.phantomPath;
            }
            return yield new Promise((resolve, reject) => {
                try {
                    pdf.create(html, phantomjsConfig)
                        .toFile(dest, (error, res) => {
                        if (error) {
                            return reject(error);
                        }
                        else {
                            utility.openFile(dest);
                            return resolve(dest);
                        }
                    });
                }
                catch (error) {
                    let errorMessage = error.toString();
                    if (errorMessage.indexOf("Error: write EPIPE") >= 0) {
                        errorMessage = `"phantomjs" is required to be installed.`;
                    }
                    return reject(errorMessage);
                }
            });
        });
    }
    /**
     * prince pdf file export
     * @return dest if success, error if failure
     */
    princeExport() {
        return __awaiter(this, void 0, void 0, function* () {
            const inputString = yield utility.readFile(this.filePath, { encoding: 'utf-8' });
            let { html, yamlConfig } = yield this.parseMD(inputString, { useRelativeFilePath: false, hideFrontMatter: true, isForPreview: false });
            let dest = this.filePath;
            let extname = path.extname(dest);
            dest = dest.replace(new RegExp(extname + '$'), '.pdf');
            html = yield this.generateHTMLFromTemplate(html, yamlConfig, {
                isForPrint: true,
                isForPrince: true,
                embedLocalImages: false,
                offline: true
            });
            const info = yield utility.tempOpen({ prefix: 'markdown-preview-enhanced', suffix: '.html' });
            yield utility.writeFile(info.fd, html);
            if (yamlConfig['isPresentationMode']) {
                const url = 'file:///' + info.path + '?print-pdf';
                return url;
            }
            else {
                yield prince_convert_1.princeConvert(info.path, dest);
                //  open pdf
                utility.openFile(dest);
                return dest;
            }
        });
    }
    eBookDownloadImages($, dest) {
        return __awaiter(this, void 0, void 0, function* () {
            const imagesToDownload = [];
            if (path.extname(dest) === '.epub' || path.extname('dest') === '.mobi') {
                $('img').each((offset, img) => {
                    const $img = $(img);
                    const src = $img.attr('src') || '';
                    if (src.match(/^https?\:\/\//))
                        imagesToDownload.push($img);
                });
            }
            const asyncFunctions = imagesToDownload.map(($img) => {
                return new Promise((resolve, reject) => {
                    const httpSrc = $img.attr('src');
                    let savePath = Math.random().toString(36).substr(2, 9) + '_' + path.basename(httpSrc);
                    savePath = path.resolve(this.fileDirectoryPath, savePath);
                    const stream = request(httpSrc).pipe(fs.createWriteStream(savePath));
                    stream.on('finish', () => {
                        $img.attr('src', 'file:///' + savePath);
                        return resolve(savePath);
                    });
                });
            });
            return yield Promise.all(asyncFunctions);
        });
    }
    /**
     *
     * @param fileType: `epub`, `pdf`, `mobi` or `html`
     * @return dest if success, error if failure
     */
    eBookExport(fileType = 'epub') {
        return __awaiter(this, void 0, void 0, function* () {
            const inputString = yield utility.readFile(this.filePath, { encoding: 'utf-8' });
            let { html, yamlConfig } = yield this.parseMD(inputString, { useRelativeFilePath: false, hideFrontMatter: true, isForPreview: false });
            let dest = this.filePath;
            let extname = path.extname(dest);
            dest = dest.replace(new RegExp(extname + '$'), '.' + fileType.toLowerCase());
            let ebookConfig = yamlConfig['ebook'];
            if (!ebookConfig)
                throw 'eBook config not found. Please insert ebook front-matter to your markdown file.';
            if (ebookConfig['cover']) {
                const cover = ebookConfig['cover'];
                ebookConfig['cover'] = this.resolveFilePath(cover, false).replace(/^file\:\/\/+/, '/');
            }
            let $ = cheerio.load(`<div>${html}</div>`, { xmlMode: true });
            const tocStructure = [];
            let headingOffset = 0;
            const $toc = $(':root > ul').last();
            if ($toc.length) {
                if (ebookConfig['include_toc'] === false) {
                    const $prev = $toc.prev();
                    if ($prev.length && $prev[0].name.match(/^h\d$/i)) {
                        $prev.remove();
                    }
                }
                $(':root').children('h1, h2, h3, h4, h5, h6').each((offset, h) => {
                    const $h = $(h);
                    const level = parseInt($h[0].name.slice(1)) - 1;
                    // $h.attr('id', id)
                    $h.attr('ebook-toc-level-' + (level + 1), '');
                    $h.attr('heading', $h.html());
                });
                getStructure($toc, 0); // analyze TOC
                if (ebookConfig['include_toc'] === false) {
                    $toc.remove();
                }
            }
            // load the last ul as TOC, analyze toc links 
            function getStructure($ul, level) {
                $ul.children('li').each((offset, li) => {
                    const $li = $(li);
                    const $a = $li.children('a').first();
                    if (!$a.length)
                        return;
                    const filePath = $a.attr('href'); // markdown file path 
                    const heading = $a.html();
                    const id = 'ebook-heading-id-' + headingOffset;
                    tocStructure.push({ level, filePath, heading, id });
                    headingOffset += 1;
                    $a.attr('href', '#' + id); // change id 
                    if ($li.children().length > 1) {
                        getStructure($li.children().last(), level + 1);
                    }
                });
            }
            // load each markdown files according to `tocStructure`
            const asyncFunctions = tocStructure.map(({ heading, id, level, filePath }, offset) => {
                return new Promise((resolve, reject) => {
                    let fileProtocalMatch;
                    if (fileProtocalMatch = filePath.match(/^file:\/\/+/))
                        filePath = filePath.replace(fileProtocalMatch[0], '/');
                    fs.readFile(filePath, { encoding: 'utf-8' }, (error, text) => {
                        if (error)
                            return reject(error.toString());
                        this.parseMD(text, { useRelativeFilePath: false, isForPreview: false, hideFrontMatter: true })
                            .then(({ html }) => {
                            return resolve({ heading, id, level, filePath, html, offset });
                        });
                    });
                });
            });
            let outputHTML = $.html().replace(/^<div>(.+)<\/div>$/, '$1');
            let results = yield Promise.all(asyncFunctions);
            results = results.sort((a, b) => a['offset'] - b['offset']);
            results.forEach(({ heading, id, level, filePath, html }) => {
                const $ = cheerio.load(`<div>${html}</div>`, { xmlMode: true });
                const $firstChild = $(':root').children().first();
                if ($firstChild.length) {
                    $firstChild.attr('id', id);
                    $firstChild.attr('ebook-toc-level-' + (level + 1), '');
                    $firstChild.attr('heading', heading);
                }
                outputHTML += $.html().replace(/^<div>(.+)<\/div>$/, '$1'); // append new content
            });
            $ = cheerio.load(outputHTML, { xmlMode: true });
            const downloadedImagePaths = yield this.eBookDownloadImages($, dest);
            // convert image to base64 if output html 
            if (path.extname(dest) === '.html') {
                // check cover 
                let coverImage = '';
                if (ebookConfig['cover']) {
                    const cover = ebookConfig['cover'][0] === '/' ? ('file:///' + ebookConfig['cover']) : ebookConfig['cover'];
                    $(':root').children().first().prepend(`<img style="display:block; margin-bottom: 24px;" src="${cover}">`);
                }
                $ = yield this.embedLocalImages($);
            }
            // retrieve html 
            outputHTML = $.html();
            const title = ebookConfig['title'] || 'no title';
            // math
            let mathStyle = '';
            if (outputHTML.indexOf('class="katex"') > 0) {
                if (path.extname(dest) == '.html' && ebookConfig['html'] && ebookConfig['html'].cdn) {
                    mathStyle = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css">`;
                }
                else {
                    mathStyle = `<link rel="stylesheet" href="file:///${path.resolve(extensionDirectoryPath, './dependencies/katex/katex.min.css')}">`;
                }
            }
            // prism and preview theme 
            let styleCSS = "";
            try {
                const styles = yield Promise.all([
                    // style template
                    utility.readFile(path.resolve(extensionDirectoryPath, './styles/style-template.css'), { encoding: 'utf-8' }),
                    // prism *.css
                    utility.readFile(path.resolve(extensionDirectoryPath, `./dependencies/prism/themes/${this.config.codeBlockTheme}`), { encoding: 'utf-8' }),
                    // preview theme
                    utility.readFile(path.resolve(extensionDirectoryPath, `./styles/${this.config.previewTheme}`), { encoding: 'utf-8' })
                ]);
                styleCSS = styles.join('');
            }
            catch (e) {
                styleCSS = '';
            }
            // global styles 
            let globalStyles = "";
            try {
                globalStyles = yield utility.getGlobalStyles();
            }
            catch (error) {
                // ignore it 
            }
            // only use github-light style for ebook
            html = `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <meta charset=\"utf-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <style> 
    ${styleCSS} 
    ${globalStyles} 
    </style>
    ${mathStyle}
  </head>
  <body class="markdown-preview-enhanced">
  ${outputHTML}
  </body>
</html>            
`;
            const fileName = path.basename(dest);
            // save as html 
            if (path.extname(dest) === '.html') {
                yield utility.writeFile(dest, html);
                return dest;
            }
            // this function will be called later 
            function deleteDownloadedImages() {
                downloadedImagePaths.forEach((imagePath) => {
                    fs.unlink(imagePath, (error) => { });
                });
            }
            try {
                const info = yield utility.tempOpen({ prefix: 'markdown-preview-enhanced', suffix: '.html' });
                yield utility.write(info.fd, html);
                yield ebook_convert_1.ebookConvert(info.path, dest, ebookConfig);
                deleteDownloadedImages();
                return dest;
            }
            catch (error) {
                deleteDownloadedImages();
                throw error;
            }
        });
    }
    /**
     * pandoc export
     */
    pandocExport() {
        return __awaiter(this, void 0, void 0, function* () {
            const inputString = yield utility.readFile(this.filePath, { encoding: 'utf-8' });
            const { data: config } = this.processFrontMatter(inputString, false);
            let content = inputString;
            if (content.match(/\-\-\-\s+/)) {
                const end = content.indexOf('---\n', 4);
                content = content.slice(end + 4);
            }
            const outputFilePath = yield pandoc_convert_1.pandocConvert(content, {
                fileDirectoryPath: this.fileDirectoryPath,
                projectDirectoryPath: this.projectDirectoryPath,
                sourceFilePath: this.filePath,
                protocolsWhiteListRegExp: this.protocolsWhiteListRegExp,
                // deleteImages: true,
                filesCache: this.filesCache,
                codeChunksData: this.codeChunksData,
                graphsCache: this.graphsCache,
                imageDirectoryPath: this.config.imageFolderPath
            }, config);
            utility.openFile(outputFilePath);
            return outputFilePath;
        });
    }
    /**
     * markdown(gfm) export
     */
    markdownExport() {
        return __awaiter(this, void 0, void 0, function* () {
            let inputString = yield utility.readFile(this.filePath, { encoding: 'utf-8' });
            let { data: config } = this.processFrontMatter(inputString, false);
            if (inputString.startsWith('---\n')) {
                const end = inputString.indexOf('---\n', 4);
                inputString = inputString.slice(end + 4);
            }
            config = config['markdown'] || {};
            if (!config['image_dir']) {
                config['image_dir'] = this.config.imageFolderPath;
            }
            if (!config['path']) {
                if (this.filePath.match(/\.src\./)) {
                    config['path'] = this.filePath.replace(/\.src\./, '.');
                }
                else {
                    config['path'] = this.filePath.replace(new RegExp(path.extname(this.filePath)), '_' + path.extname(this.filePath));
                }
                config['path'] = path.basename(config['path']);
            }
            if (config['front_matter']) {
                inputString = matter.stringify(inputString, config['front-matter']);
            }
            return yield markdown_convert_1.markdownConvert(inputString, {
                projectDirectoryPath: this.projectDirectoryPath,
                fileDirectoryPath: this.fileDirectoryPath,
                protocolsWhiteListRegExp: this.protocolsWhiteListRegExp,
                filesCache: this.filesCache,
                mathInlineDelimiters: this.config.mathInlineDelimiters,
                mathBlockDelimiters: this.config.mathBlockDelimiters,
                codeChunksData: this.codeChunksData,
                graphsCache: this.graphsCache,
                usePandocParser: this.config.usePandocParser
            }, config);
        });
    }
    /**
     *
     * @param filePath
     * @param relative: whether to use the path relative to filePath or not.
     */
    resolveFilePath(filePath = '', relative) {
        if (filePath.match(this.protocolsWhiteListRegExp) ||
            filePath.startsWith('data:image/') ||
            filePath[0] == '#') {
            return filePath;
        }
        else if (filePath[0] == '/') {
            if (relative)
                return path.relative(this.fileDirectoryPath, path.resolve(this.projectDirectoryPath, '.' + filePath));
            else
                return 'file:///' + path.resolve(this.projectDirectoryPath, '.' + filePath);
        }
        else {
            if (relative)
                return filePath;
            else
                return 'file:///' + path.resolve(this.fileDirectoryPath, filePath);
        }
    }
    /**
     * Run code chunk of `id`
     * @param id
     */
    runCodeChunk(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let codeChunkData = this.codeChunksData[id];
            if (!codeChunkData)
                return '';
            if (codeChunkData.running)
                return '';
            let code = codeChunkData.code;
            let cc = codeChunkData;
            while (cc.options['continue']) {
                let id = cc.options['continue'];
                if (id === true) {
                    id = cc.prev;
                }
                cc = this.codeChunksData[id];
                if (!cc)
                    break;
                code = cc.code + code;
            }
            codeChunkData.running = true;
            let result;
            try {
                const options = codeChunkData.options;
                if (options['cmd'] === 'toc') {
                    const tocObject = toc_1.toc(this.headings, { ordered: options['orderedList'], depthFrom: options['depthFrom'], depthTo: options['depthTo'], tab: options['tab'] || '\t' });
                    result = tocObject.content;
                }
                else {
                    result = yield CodeChunkAPI.run(code, this.fileDirectoryPath, codeChunkData.options);
                }
                codeChunkData.plainResult = result;
                if (codeChunkData.options['modify_source'] && ('code_chunk_offset' in codeChunkData.options)) {
                    codeChunkData.result = '';
                    return MarkdownEngine.modifySource(codeChunkData, result, this.filePath);
                }
                const outputFormat = codeChunkData.options['output'] || 'text';
                if (!result) {
                    result = '';
                }
                else if (outputFormat === 'html') {
                    result = result;
                }
                else if (outputFormat === 'png') {
                    const base64 = new Buffer(result).toString('base64');
                    result = `<img src="data:image/png;charset=utf-8;base64,${base64}">`;
                }
                else if (outputFormat === 'markdown') {
                    const { html } = yield this.parseMD(result, { useRelativeFilePath: true, isForPreview: false, hideFrontMatter: true });
                    result = html;
                }
                else if (outputFormat === 'none') {
                    result = '';
                }
                else {
                    result = `<pre class="language-text">${result}</pre>`;
                }
            }
            catch (error) {
                result = `<pre class="language-text">${error}</pre>`;
            }
            codeChunkData.result = result; // save result.
            codeChunkData.running = false;
            return result;
        });
    }
    runAllCodeChunks() {
        return __awaiter(this, void 0, void 0, function* () {
            const asyncFunctions = [];
            for (let id in this.codeChunksData) {
                asyncFunctions.push(this.runCodeChunk(id));
            }
            return yield Promise.all(asyncFunctions);
        });
    }
    /**
     * Add line numbers to code block <pre> element
     * @param
     * @param code
     */
    addLineNumbersIfNecessary($preElement, code) {
        if ($preElement.hasClass('line-numbers')) {
            const match = code.match(/\n(?!$)/g);
            const linesNum = match ? (match.length + 1) : 1;
            let lines = '';
            for (let i = 0; i < linesNum; i++) {
                lines += '<span></span>';
            }
            $preElement.append(`<span aria-hidden="true" class="line-numbers-rows">${lines}</span>`);
        }
    }
    /**
     *
     * @param preElement the cheerio element
     * @param parameters is in the format of `lang {opt1:val1, opt2:val2}` or just `lang`
     * @param text
     */
    renderCodeBlock($, $preElement, code, parameters, { graphsCache, codeChunksArray, isForPreview, triggeredBySave }) {
        return __awaiter(this, void 0, void 0, function* () {
            let match, lang, optionsStr, options;
            if (match = parameters.match(/\s*([^\s]+)\s+\{(.+?)\}/)) {
                lang = match[1];
                optionsStr = match[2];
            }
            else {
                lang = parameters;
                optionsStr = '';
            }
            if (optionsStr) {
                try {
                    options = jsonic('{' + optionsStr + '}');
                }
                catch (e) {
                    return $preElement.replaceWith(`<pre class="language-text">OptionsError: ${'{' + optionsStr + '}'}<br>${e.toString()}</pre>`);
                }
            }
            else {
                options = {};
            }
            const renderPlainCodeBlock = () => {
                try {
                    if (!Prism) {
                        Prism = require(path.resolve(extensionDirectoryPath, './dependencies/prism/prism.js'));
                    }
                    const html = Prism.highlight(code, Prism.languages[extension_helper_1.scopeForLanguageName(lang)]);
                    $preElement.html(html);
                }
                catch (e) {
                    // do nothing
                }
                if (options['class']) {
                    $preElement.addClass(options['class']);
                    this.addLineNumbersIfNecessary($preElement, code);
                }
            };
            const codeBlockOnly = options['code_block'];
            if (codeBlockOnly) {
                renderPlainCodeBlock();
            }
            else if (lang.match(/^(puml|plantuml)$/)) {
                const checksum = md5(optionsStr + code);
                let svg = this.graphsCache[checksum];
                if (!svg) {
                    svg = yield plantumlAPI.render(code, this.fileDirectoryPath);
                }
                $preElement.replaceWith(`<p>${svg}</p>`);
                graphsCache[checksum] = svg; // store to new cache 
            }
            else if (lang.match(/^mermaid$/)) {
                /*
                // it doesn't work well...
                // the cache doesn't work well.
                const checksum = md5(optionsStr + code)
                let svg:string = this.graphsCache[checksum]
                if (!svg) {
                  $preElement.replaceWith(`<div class="mermaid">${code}</div>`)
                } else {
                  $preElement.replaceWith(svg)
                  graphsCache[checksum] = svg // store to new cache
                }
                */
                $preElement.replaceWith(`<div class="mermaid">${code}</div>`);
            }
            else if (lang.match(/^(dot|viz)$/)) {
                const checksum = md5(optionsStr + code);
                let svg = this.graphsCache[checksum];
                if (!svg) {
                    try {
                        let engine = options['engine'] || "dot";
                        svg = Viz(code, { engine });
                        $preElement.replaceWith(`<p>${svg}</p>`);
                        graphsCache[checksum] = svg; // store to new cache
                    }
                    catch (e) {
                        $preElement.replaceWith(`<pre class="language-text">${e.toString()}</pre>`);
                    }
                }
                else {
                    $preElement.replaceWith(`<p>${svg}</p>`);
                    graphsCache[checksum] = svg; // store to new cache
                }
            }
            else if (options['cmd']) {
                const $el = $("<div class=\"code-chunk\"></div>"); // create code chunk
                if (!options['id']) {
                    options['id'] = 'mpe-code-chunk-id-' + codeChunksArray.length;
                }
                if (options['cmd'] === true) {
                    options['cmd'] = lang;
                }
                $el.attr({
                    'data-id': options['id'],
                    'data-cmd': options['cmd'],
                    'data-code': options['cmd'] === 'javascript' ? code : ''
                });
                let highlightedBlock = '';
                if (!options['hide']) {
                    try {
                        if (!Prism) {
                            Prism = require(path.resolve(extensionDirectoryPath, './dependencies/prism/prism.js'));
                        }
                        highlightedBlock = `<pre class="language-${lang} ${options['class'] || ''}">${Prism.highlight(code, Prism.languages[extension_helper_1.scopeForLanguageName(lang)])}</pre>`;
                    }
                    catch (e) {
                        // do nothing
                        highlightedBlock = `<pre class="language-text ${options['class'] || ''}">${code}</pre>`;
                    }
                    const $highlightedBlock = $(highlightedBlock);
                    this.addLineNumbersIfNecessary($highlightedBlock, code);
                    highlightedBlock = $.html($highlightedBlock);
                }
                /*
                if (!options['id']) { // id is required for code chunk
                  highlightedBlock = `<pre class="language-text">'id' is required for code chunk</pre>`
                }*/
                let codeChunkData = this.codeChunksData[options['id']];
                let previousCodeChunkDataId = codeChunksArray.length ? codeChunksArray[codeChunksArray.length - 1].id : '';
                if (!codeChunkData) {
                    codeChunkData = {
                        id: options['id'],
                        code,
                        options: options,
                        result: '',
                        plainResult: '',
                        running: false,
                        prev: previousCodeChunkDataId,
                        next: null
                    };
                    this.codeChunksData[options['id']] = codeChunkData;
                }
                else {
                    codeChunkData.code = code;
                    codeChunkData.options = options;
                    codeChunkData.prev = previousCodeChunkDataId;
                }
                if (previousCodeChunkDataId && this.codeChunksData[previousCodeChunkDataId])
                    this.codeChunksData[previousCodeChunkDataId].next = options['id'];
                codeChunksArray.push(codeChunkData); // this line has to be put above the `if` statement.
                if (triggeredBySave && options['run_on_save']) {
                    yield this.runCodeChunk(options['id']);
                }
                let result = codeChunkData.result;
                // element option 
                if (!result && codeChunkData.options['element']) {
                    result = codeChunkData.options['element'];
                    codeChunkData.result = result;
                }
                if (codeChunkData.running) {
                    $el.addClass('running');
                }
                const statusDiv = `<div class="status">running...</div>`;
                const buttonGroup = '<div class="btn-group"><div class="run-btn btn"><span>▶︎</span></div><div class=\"run-all-btn btn\">all</div></div>';
                let outputDiv = `<div class="output-div">${result}</div>`;
                // check javascript code chunk
                if (!isForPreview && options['cmd'] === 'javascript') {
                    outputDiv += `<script>${code}</script>`;
                    result = codeChunkData.options['element'] || '';
                }
                $el.append(highlightedBlock);
                $el.append(buttonGroup);
                $el.append(statusDiv);
                $el.append(outputDiv);
                $preElement.replaceWith($el);
            }
            else {
                renderPlainCodeBlock();
            }
        });
    }
    /**
     * This function resovle image paths and render code blocks
     * @param html the html string that we will analyze
     * @return html
     */
    resolveImagePathAndCodeBlock(html, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let $ = cheerio.load(html, { xmlMode: true });
            // new caches
            // which will be set when this.renderCodeBlocks is called
            const newGraphsCache = {};
            const codeChunksArray = [];
            const asyncFunctions = [];
            $('pre').each((i, preElement) => {
                let codeBlock, lang, code;
                const $preElement = $(preElement);
                if (preElement.children[0] && preElement.children[0].name === 'code') {
                    codeBlock = $preElement.children().first();
                    lang = 'text';
                    let classes = codeBlock.attr('class');
                    if (!classes)
                        classes = 'language-text';
                    lang = classes.replace(/^language-/, '');
                    code = codeBlock.text();
                    $preElement.attr('class', classes);
                    $preElement.children().first().addClass(classes);
                }
                else {
                    lang = 'text';
                    if (preElement.children[0])
                        code = preElement.children[0].data;
                    else
                        code = '';
                    $preElement.attr('class', 'language-text');
                }
                asyncFunctions.push(this.renderCodeBlock($, $preElement, code, lang, { graphsCache: newGraphsCache, codeChunksArray, isForPreview: options.isForPreview, triggeredBySave: options.triggeredBySave }));
            });
            yield Promise.all(asyncFunctions);
            // resolve image paths
            $('img, a').each((i, imgElement) => {
                let srcTag = 'src';
                if (imgElement.name === 'a')
                    srcTag = 'href';
                const img = $(imgElement);
                const src = img.attr(srcTag);
                img.attr(srcTag, this.resolveFilePath(src, options.useRelativeFilePath));
            });
            // reset caches 
            // the line below actually has problem.
            if (options.isForPreview) {
                this.graphsCache = newGraphsCache;
                // console.log(this.graphsCache)
            }
            return $.html();
        });
    }
    /**
     * return this.cachedHTML
     */
    getCachedHTML() {
        return this.cachedHTML;
    }
    /**
     * clearCaches will clear filesCache, codeChunksData, graphsCache
     */
    clearCaches() {
        this.filesCache = {};
        this.codeChunksData = {};
        this.graphsCache = {};
    }
    frontMatterToTable(arg) {
        if (arg instanceof Array) {
            let tbody = "<tbody><tr>";
            arg.forEach((item) => tbody += `<td>${this.frontMatterToTable(item)}</td>`);
            tbody += "</tr></tbody>";
            return `<table>${tbody}</table>`;
        }
        else if (typeof (arg) === 'object') {
            let thead = "<thead><tr>";
            let tbody = "<tbody><tr>";
            for (let key in arg) {
                thead += `<th>${key}</th>`;
                tbody += `<td>${this.frontMatterToTable(arg[key])}</td>`;
            }
            thead += "</tr></thead>";
            tbody += "</tr></tbody>";
            return `<table>${thead}${tbody}</table>`;
        }
        else {
            return arg;
        }
    }
    /**
     * process input string, skip front-matter
     * if usePandocParser. return {
     *      content: frontMatterString
     * }
     * else if display table. return {
     *      table: string of <table>...</table> generated from data
     *      content: ''
     * }
     * else return {
     *      content: replace ---\n with ```yaml
     * }
     *
     */
    processFrontMatter(frontMatterString, hideFrontMatter = false) {
        if (frontMatterString) {
            let data = matter(frontMatterString).data;
            if (this.config.usePandocParser) {
                return { content: frontMatterString, table: '', data: data || {} };
            }
            else if (hideFrontMatter || this.config.frontMatterRenderingOption[0] == 'n') {
                return { content: '', table: '', data };
            }
            else if (this.config.frontMatterRenderingOption[0] === 't') {
                // to table
                let table;
                if (typeof (data) === 'object')
                    table = this.frontMatterToTable(data);
                else
                    table = "<pre>Failed to parse YAML.</pre>";
                return { content: '', table, data };
            }
            else {
                const content = frontMatterString.replace(/^---/, '```yaml').replace(/---\n$/, '```\n');
                return { content, table: '', data };
            }
        }
        else {
            return { content: frontMatterString, table: '', data: {} };
        }
    }
    /**
     * Parse `html` to generate slides
     * @param html
     * @param slideConfigs
     * @param yamlConfig
     */
    parseSlides(html, slideConfigs, yamlConfig) {
        let slides = html.split('<span class="new-slide"></span>');
        let output = '';
        let width = 960, height = 700;
        let presentationConfig = {};
        if (yamlConfig && yamlConfig['presentation']) {
            presentationConfig = yamlConfig['presentation'];
            width = presentationConfig['width'] || 960;
            height = presentationConfig['height'] || 700;
        }
        slides.forEach((slide, offset) => {
            if (!offset) {
                return output += `<div style='display: none;'>${slide}</div>`;
            }
            offset = offset - 1;
            const slideConfig = slideConfigs[offset] || {};
            let styleString = '', videoString = '', iframeString = '', classString = slideConfig['class'] || '', idString = slideConfig['id'] ? `id="${slideConfig['id']}"` : '';
            if (slideConfig['data-background-image']) {
                styleString += `background-image: url('${this.resolveFilePath(slideConfig['data-background-image'], false)}');`;
                if (slideConfig['data-background-size'])
                    styleString += `background-size: ${slideConfig['data-background-size']};`;
                else
                    styleString += "background-size: cover;";
                if (slideConfig['data-background-position'])
                    styleString += `background-position: ${slideConfig['data-background-position']};`;
                else
                    styleString += "background-position: center;";
                if (slideConfig['data-background-repeat'])
                    styleString += `background-repeat: ${slideConfig['data-background-repeat']};`;
                else
                    styleString += "background-repeat: no-repeat;";
            }
            else if (slideConfig['data-background-color']) {
                styleString += `background-color: ${slideConfig['data-background-color']} !important;`;
            }
            else if (slideConfig['data-background-video']) {
                const videoMuted = slideConfig['data-background-video-muted'];
                const videoLoop = slideConfig['data-background-video-loop'];
                const muted_ = videoMuted ? 'muted' : '';
                const loop_ = videoLoop ? 'loop' : '';
                videoString = `
        <video ${muted_} ${loop_} playsinline autoplay class="background-video" src="${this.resolveFilePath(slideConfig['data-background-video'], false)}">
        </video>
        `;
            }
            else if (slideConfig['data-background-iframe']) {
                iframeString = `
        <iframe class="background-iframe" src="${this.resolveFilePath(slideConfig['data-background-iframe'], false)}" frameborder="0" > </iframe>
        <div class="background-iframe-overlay"></div>
        `;
            }
            output += `
        <div class='slide ${classString}' ${idString} data-line="${slideConfig['lineNo']}" data-offset='${offset}' style="width: ${width}px; height: ${height}px; ${styleString}">
          ${videoString}
          ${iframeString}
          <section>${slide}</section>
        </div>
      `;
        });
        // remove <aside class="notes"> ... </aside>
        output = output.replace(/(<aside\b[^>]*>)[^<>]*(<\/aside>)/ig, '');
        return `
    <div id="preview-slides" data-width="${width}" data-height="${height}">
      ${output}
    </div>
    `;
    }
    parseSlidesForExport(html, slideConfigs, useRelativeFilePath) {
        let slides = html.split('<span class="new-slide"></span>');
        let before = slides[0];
        slides = slides.slice(1);
        let output = '';
        const parseAttrString = (slideConfig) => {
            let attrString = '';
            if (slideConfig['data-background-image'])
                attrString += ` data-background-image='${this.resolveFilePath(slideConfig['data-background-image'], useRelativeFilePath)}'`;
            if (slideConfig['data-background-size'])
                attrString += ` data-background-size='${slideConfig['data-background-size']}'`;
            if (slideConfig['data-background-position'])
                attrString += ` data-background-position='${slideConfig['data-background-position']}'`;
            if (slideConfig['data-background-repeat'])
                attrString += ` data-background-repeat='${slideConfig['data-background-repeat']}'`;
            if (slideConfig['data-background-color'])
                attrString += ` data-background-color='${slideConfig['data-background-color']}'`;
            if (slideConfig['data-notes'])
                attrString += ` data-notes='${slideConfig['data-notes']}'`;
            if (slideConfig['data-background-video'])
                attrString += ` data-background-video='${this.resolveFilePath(slideConfig['data-background-video'], useRelativeFilePath)}'`;
            if (slideConfig['data-background-video-loop'])
                attrString += ` data-background-video-loop`;
            if (slideConfig['data-background-video-muted'])
                attrString += ` data-background-video-muted`;
            if (slideConfig['data-transition'])
                attrString += ` data-transition='${slideConfig['data-transition']}'`;
            if (slideConfig['data-background-iframe'])
                attrString += ` data-background-iframe='${this.resolveFilePath(slideConfig['data-background-iframe'], useRelativeFilePath)}'`;
            return attrString;
        };
        let i = 0;
        while (i < slides.length) {
            const slide = slides[i];
            const slideConfig = slideConfigs[i];
            const attrString = parseAttrString(slideConfig);
            const classString = slideConfig['class'] || '';
            const idString = slideConfig['id'] ? `id="${slideConfig['id']}"` : '';
            if (!slideConfig['vertical']) {
                if (i > 0 && slideConfigs[i - 1]['vertical'])
                    output += '</section>';
                if (i < slides.length - 1 && slideConfigs[i + 1]['vertical'])
                    output += "<section>";
            }
            output += `<section ${attrString} ${idString} class=\"${classString}\">${slide}</section>`;
            i += 1;
        }
        if (i > 0 && slideConfigs[i - 1]['vertical'])
            output += "</section>";
        return `
    <div style="display:none;">${before}</div>
    <div class="reveal">
      <div class="slides">
        ${output}
      </div>
    </div>
    `;
    }
    pandocRender(text = '', args) {
        return __awaiter(this, void 0, void 0, function* () {
            args = args || [];
            args = ['-f', this.config.pandocMarkdownFlavor,
                '-t', 'html',
                '--mathjax']
                .concat(args).filter((arg) => arg.length);
            /*
            convert code block
            ```python {id:"haha"}
            to
            ```{.python data-code-block:"{id: haha}"}
            */
            let outputString = "";
            let lines = text.split('\n');
            let i = 0;
            let inCodeBlock = false;
            while (i < lines.length) {
                let line = lines[i];
                if (line.startsWith('```')) {
                    inCodeBlock = !inCodeBlock;
                    if (inCodeBlock) {
                        let lang = utility.escapeString(line.slice(3)).trim();
                        if (!lang)
                            lang = 'text';
                        outputString += `<pre><code class="language-${lang}" >`;
                    }
                    else {
                        outputString += '</code></pre>\n';
                    }
                    i += 1;
                    continue;
                }
                if (line.match(/^\[toc\]/i) && !inCodeBlock) {
                    line = '[MPETOC]';
                }
                outputString += line + '\n';
                i += 1;
            }
            const pandocPath = this.config.pandocPath;
            return yield new Promise((resolve, reject) => {
                try {
                    const program = child_process_1.execFile(pandocPath, args, { cwd: this.fileDirectoryPath }, (error, stdout, stderr) => {
                        if (error)
                            return reject(error);
                        if (stderr)
                            return reject(stderr);
                        return resolve(stdout);
                    });
                    program.stdin.end(outputString, 'utf-8');
                }
                catch (error) {
                    let errorMessage = error.toString();
                    if (errorMessage.indexOf("Error: write EPIPE") >= 0) {
                        errorMessage = `"pandoc" is required to be installed.\nCheck "http://pandoc.org/installing.html" website.`;
                    }
                    return reject(errorMessage);
                }
            });
        });
    }
    parseMD(inputString, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!inputString)
                inputString = yield utility.readFile(this.filePath, { encoding: 'utf-8' });
            // import external files and insert anchors if necessary 
            let { outputString, slideConfigs, tocBracketEnabled, JSAndCssFiles, headings, frontMatterString } = yield transformer_1.transformMarkdown(inputString, {
                fileDirectoryPath: this.fileDirectoryPath,
                projectDirectoryPath: this.projectDirectoryPath,
                forPreview: options.isForPreview,
                protocolsWhiteListRegExp: this.protocolsWhiteListRegExp,
                useRelativeFilePath: options.useRelativeFilePath,
                filesCache: this.filesCache,
                usePandocParser: this.config.usePandocParser
            });
            // process front-matter
            const fm = this.processFrontMatter(frontMatterString, options.hideFrontMatter);
            const frontMatterTable = fm.table, yamlConfig = fm.data || {};
            outputString = fm.content + outputString;
            /**
             * render markdown to html
             */
            let html;
            if (this.config.usePandocParser) {
                try {
                    let args = yamlConfig['pandoc_args'] || [];
                    if (!(args instanceof Array))
                        args = [];
                    // check bibliography
                    if (yamlConfig['bibliography'] || yamlConfig['references'])
                        args.push('--filter', 'pandoc-citeproc');
                    args = this.config.pandocArguments.concat(args);
                    html = yield this.pandocRender(outputString, args);
                }
                catch (error) {
                    html = `<pre>${error}</pre>`;
                }
            }
            else {
                html = this.md.render(outputString);
            }
            /**
             * render tocHTML
             */
            if (!utility.isArrayEqual(headings, this.headings)) {
                const tocObject = toc_1.toc(headings, { ordered: false, depthFrom: 1, depthTo: 6, tab: '\t' });
                this.tocHTML = this.md.render(tocObject.content);
            }
            this.headings = headings; // reset headings information
            if (tocBracketEnabled) {
                html = html.replace(/^\s*<p>\[MPETOC\]<\/p>\s*/gm, this.tocHTML);
            }
            /**
             * resolve image paths and render code block.
             */
            html = frontMatterTable + (yield this.resolveImagePathAndCodeBlock(html, options));
            /**
             * check slides
             */
            if (slideConfigs.length) {
                if (options.isForPreview) {
                    html = this.parseSlides(html, slideConfigs, yamlConfig);
                }
                else {
                    html = this.parseSlidesForExport(html, slideConfigs, options.useRelativeFilePath);
                }
                if (yamlConfig)
                    yamlConfig['isPresentationMode'] = true; // mark as presentation mode
            }
            this.cachedHTML = html; // save to cache
            return { html, markdown: inputString, tocHTML: this.tocHTML, yamlConfig, JSAndCssFiles };
        });
    }
}
exports.MarkdownEngine = MarkdownEngine;
//# sourceMappingURL=markdown-engine.js.map