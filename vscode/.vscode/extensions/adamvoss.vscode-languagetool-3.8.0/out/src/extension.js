'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const net = require("net");
const child_process = require("child_process");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
function activate(context) {
    function discoverExtensionPaths() {
        return vscode_1.extensions.all
            .filter(x => x.id.startsWith("adamvoss.vscode-languagetool-"))
            .map(x => x.extensionPath);
    }
    function buildDesiredClasspath() {
        const isWindows = process.platform === 'win32';
        const joinCharacter = isWindows ? ';' : ':';
        const additionalPaths = discoverExtensionPaths()
            .map(p => path.resolve(context.extensionPath, '..', p, 'lib', '*'))
            .join(joinCharacter);
        let desiredClasspath = path.join('lib', '*');
        if (additionalPaths) {
            desiredClasspath += joinCharacter + additionalPaths;
        }
        return desiredClasspath;
    }
    function setClasspath(text, desiredClasspath) {
        const classpathRegexp = /^((?:set )?CLASSPATH=[%$]APP_HOME%?[\\\/])(.*)$/m;
        return text.replace(classpathRegexp, `$1${desiredClasspath}`);
    }
    function createServer() {
        return new Promise((resolve, reject) => {
            var server = net.createServer((socket) => {
                console.log("Creating server");
                resolve({
                    reader: socket,
                    writer: socket
                });
                socket.on('end', () => console.log("Disconnected"));
            }).on('error', (err) => {
                // handle errors here
                throw err;
            });
            let isWindows = process.platform === 'win32';
            // grab a random port.
            server.listen(() => {
                // Start the child java process
                let options = { cwd: vscode_1.workspace.rootPath };
                const scriptDir = path.resolve(context.extensionPath, 'lib', 'languagetool-languageserver', 'build', 'install', 'languagetool-languageserver', 'bin');
                let originalScript = path.resolve(scriptDir, isWindows ? 'languagetool-languageserver.bat' : 'languagetool-languageserver');
                const newScript = path.resolve(scriptDir, isWindows ? 'languagetool-languageserver-live.bat' : 'languagetool-languageserver-live');
                const scriptText = fs.readFileSync(originalScript, "utf8");
                const newText = setClasspath(scriptText, buildDesiredClasspath());
                fs.writeFileSync(newScript, newText, { mode: 0o777 });
                let process = child_process.spawn(newScript, [server.address().port.toString()], options);
                // Send raw output to a file
                if (context.storagePath) {
                    if (!fs.existsSync(context.storagePath)) {
                        console.log(context.storagePath);
                        fs.mkdirSync(context.storagePath);
                    }
                    let logFile = context.storagePath + '/vscode-languagetool-languageserver.log';
                    let logStream = fs.createWriteStream(logFile, { flags: 'w' });
                    process.stdout.pipe(logStream);
                    process.stderr.pipe(logStream);
                    console.log(`Storing log in '${logFile}'`);
                }
                else {
                    console.log("No storagePath, languagetool-languageserver logging disabled.");
                }
            });
        });
    }
    ;
    // Options to control the language client
    let clientOptions = {
        documentSelector: ['plaintext', 'markdown'],
        synchronize: {
            configurationSection: 'languageTool'
        }
    };
    // Allow to enable languageTool in specific workspaces
    let config = vscode_1.workspace.getConfiguration('languageTool');
    if (config['enabled']) {
        // Create the language client and start the client.
        let disposable = new vscode_languageclient_1.LanguageClient('languageTool', 'LanguageTool Client', createServer, clientOptions).start();
        // Push the disposable to the context's subscriptions so that the 
        // client can be deactivated on extension deactivation
        context.subscriptions.push(disposable);
    }
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map