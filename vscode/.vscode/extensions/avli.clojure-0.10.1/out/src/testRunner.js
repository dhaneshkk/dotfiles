"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class ClojureTestDataProvider {
    constructor() {
        this.testsChanged = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this.testsChanged.event;
        this.results = {};
    }
    onTestResult(ns, varName, success) {
        console.log(ns, varName, success);
        // Make a copy of result with the new result assoc'ed in.
        this.results = Object.assign({}, this.results, { [ns]: Object.assign({}, this.results[ns], { [varName]: success }) });
        this.testsChanged.fire(); // Trigger the UI to update.
    }
    getNamespaceItem(element) {
        return {
            label: element.ns,
            collapsibleState: vscode_1.TreeItemCollapsibleState.Expanded
        };
    }
    getVarItem(element) {
        const passed = this.results[element.nsName][element.varName];
        return {
            label: (passed ? "✅ " : "❌ ") + element.varName,
            collapsibleState: vscode_1.TreeItemCollapsibleState.None
        };
    }
    getTreeItem(element) {
        switch (element.type) {
            case 'ns': return this.getNamespaceItem(element);
            case 'var': return this.getVarItem(element);
        }
    }
    getChildren(element) {
        if (!element) {
            return Object.keys(this.results).map((ns) => {
                const node = {
                    type: 'ns',
                    ns: ns
                };
                return node;
            });
        }
        switch (element.type) {
            case 'ns': {
                const vars = Object.keys(this.results[element.ns]);
                return vars.map((varName) => {
                    const node = {
                        type: 'var',
                        nsName: element.ns,
                        varName: varName
                    };
                    return node;
                });
            }
        }
        return null;
    }
}
exports.buildTestProvider = function () {
    return new ClojureTestDataProvider();
};
//# sourceMappingURL=testRunner.js.map