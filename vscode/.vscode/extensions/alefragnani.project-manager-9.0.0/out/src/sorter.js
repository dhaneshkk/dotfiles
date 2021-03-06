"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProjectsSorter {
    static getSortedByName(items) {
        const itemsSorted = [] = items.sort((n1, n2) => {
            // ignore octicons
            if (n1.label.replace(/\$\(\w*(-)*\w*\)\s/, "").toLowerCase() > n2.label.replace(/\$\(\w*(-)*\w*\)\s/, "").toLowerCase()) {
                return 1;
            }
            if (n1.label.replace(/\$\(\w*(-)*\w*\)\s/, "").toLowerCase() < n2.label.replace(/\$\(\w*(-)*\w*\)\s/, "").toLowerCase()) {
                return -1;
            }
            return 0;
        });
        return itemsSorted;
    }
    static getSortedByPath(items) {
        const itemsSorted = [] = items.sort((n1, n2) => {
            if (n1.description > n2.description) {
                return 1;
            }
            if (n1.description < n2.description) {
                return -1;
            }
            return 0;
        });
        return itemsSorted;
    }
    static getSortedByRecent(items, aStack) {
        if (aStack.length() === 0) {
            return items;
        }
        const loadedProjects = items;
        for (let index = 0; index < aStack.length(); index++) {
            const element = aStack.getItem(index);
            let found = -1;
            for (let i = 0; i < loadedProjects.length; i++) {
                const itemElement = loadedProjects[i];
                if (itemElement.label === element) {
                    found = i;
                    break;
                }
            }
            if (found > -1) {
                const removedProject = loadedProjects.splice(found, 1);
                loadedProjects.unshift(removedProject[0]);
            }
        }
        return loadedProjects;
    }
    /**
     * Show an information message.
     *
     * @see [showInformationMessage](#window.showInformationMessage)
     *
     * @param (string) itemsToShow The message to show.
     * @param criteria A set of items that will be rendered as actions in the message.
     * @param aStack A set of items that will be rendered as actions in the message.
     * @return Sorted list
     */
    static SortItemsByCriteria(itemsToShow, criteria, aStack) {
        let newItemsSorted = [];
        switch (criteria) {
            case "Path":
                newItemsSorted = this.getSortedByPath(itemsToShow);
                break;
            case "Saved":
                newItemsSorted = itemsToShow;
                break;
            case "Recent":
                newItemsSorted = this.getSortedByRecent(itemsToShow, aStack);
                break;
            default:
                newItemsSorted = this.getSortedByName(itemsToShow);
                break;
        }
        return newItemsSorted;
    }
}
exports.ProjectsSorter = ProjectsSorter;
//# sourceMappingURL=sorter.js.map