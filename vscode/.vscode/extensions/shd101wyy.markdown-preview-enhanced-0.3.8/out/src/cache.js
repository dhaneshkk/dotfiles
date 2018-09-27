"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cache {
    constructor(capacity, threshold) {
        this.capacity = 100;
        this.threshold = 5;
        this.count = 0;
        this.cache = {};
        this.capacity = capacity;
        this.threshold = threshold;
    }
    get(key) {
        return this.cache[key];
    }
    set(key, value) {
        if (!(key in this.cache)) {
            this.cache[key] = [value, 1];
            this.count += 1;
        }
        else {
            this.cache[key][1] = this.cache[key][1] + 1; // increase appear time
        }
        this.autoRemove();
    }
    autoRemove() {
        if (this.count > this.capacity) {
        }
    }
}
exports.Cache = Cache;
//# sourceMappingURL=cache.js.map