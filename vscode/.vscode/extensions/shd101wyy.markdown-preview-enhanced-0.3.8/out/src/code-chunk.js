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
const child_process_1 = require("child_process");
const vm = require("vm");
const utility = require("./utility");
const LaTeX = require("./latex");
function compileLaTeX(content, fileDirectoryPath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const latexEngine = options['latex_engine'] || 'pdflatex';
        const latexSVGDir = options['latex_svg_dir']; // if not provided, the svg files will be stored in temp folder and will be deleted automatically
        const latexZoom = options['latex_zoom'];
        const latexWidth = options['latex_width'];
        const latexHeight = options['latex_height'];
        const texFilePath = path.resolve(fileDirectoryPath, Math.random().toString(36).substr(2, 9) + '_code_chunk.tex');
        yield utility.writeFile(texFilePath, content);
        try {
            const svgMarkdown = yield LaTeX.toSVGMarkdown(texFilePath, { latexEngine, markdownDirectoryPath: fileDirectoryPath, svgDirectoryPath: latexSVGDir, svgZoom: latexZoom, svgWidth: latexWidth, svgHeight: latexHeight });
            fs.unlink(texFilePath, (error) => { });
            options['output'] = 'markdown'; // set output as markdown
            return svgMarkdown;
        }
        catch (e) {
            fs.unlink(texFilePath, (error) => { });
            throw e;
        }
    });
}
exports.compileLaTeX = compileLaTeX;
/**
 *
 * @param code should be a javascript function string
 * @param options
 */
function runInVm(code, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const script = new vm.Script(`((${code})())`);
        const context = vm.createContext(options['context'] || {});
        return script.runInContext(context);
    });
}
function run(content, fileDirectoryPath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = options['cmd'];
        let args = options['args'] || [];
        if (typeof (args) === 'string') {
            args = [args];
        }
        const savePath = path.resolve(fileDirectoryPath, Math.random().toString(36).substr(2, 9) + '_code_chunk');
        content = content.replace(/\u00A0/g, ' ');
        if (cmd.match(/(la)?tex/) || cmd === 'pdflatex') {
            return compileLaTeX(content, fileDirectoryPath, options);
        }
        if (cmd === 'node.vm') {
            return runInVm(content, options);
        }
        if (cmd.match(/python/) && (options['matplotlib'] || options['mpl'])) {
            content = `
# -*- coding: utf-8 -*-
# modify default matplotlib pyplot show function
try:
    import matplotlib
    matplotlib.use('Agg') # use Agg backend
    import matplotlib.pyplot as plt
    import sys
    def new_plt_show():
        plt.savefig(sys.stdout, format="svg")
    plt.show = new_plt_show # override old one
except Exception:
    pass
# modify default mpld3 behavior
try:
    import matplotlib.pyplot as plt, mpld3
    import sys
    def new_mpld3_show():
        fig = plt.gcf() # get current figure
        sys.stdout.write(mpld3.fig_to_html(fig))
    mpld3.show = new_mpld3_show # override old one
    mpld3.display = new_mpld3_show
except Exception:
    pass
` + content;
            options['output'] = 'html'; // change to html so that svg can be rendered
        }
        yield utility.writeFile(savePath, content);
        // check macros 
        let findInputFileMacro = false;
        args = args.map((arg) => {
            if (arg === '{input_file}') {
                findInputFileMacro = true;
                return savePath;
            }
            else {
                return arg;
            }
        });
        if (!findInputFileMacro && !options['stdin']) {
            args.push(savePath);
        }
        return yield new Promise((resolve, reject) => {
            const task = child_process_1.spawn(cmd, args, { cwd: fileDirectoryPath });
            if (options['stdin'])
                task.stdin.write(content);
            task.stdin.end();
            const chunks = [];
            task.stdout.on('data', (chunk) => {
                chunks.push(chunk);
            });
            task.stderr.on('data', (chunk) => {
                chunks.push(chunk);
            });
            task.on('error', (error) => {
                chunks.push(Buffer.from(error.toString(), 'utf-8'));
            });
            task.on('close', () => {
                fs.unlink(savePath, () => { });
                const data = Buffer.concat(chunks).toString();
                return resolve(data);
            });
        });
    });
}
exports.run = run;
//# sourceMappingURL=code-chunk.js.map