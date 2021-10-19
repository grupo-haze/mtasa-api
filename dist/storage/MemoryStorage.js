"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStorage = void 0;
class MemoryStorage {
    constructor() {
        this._data = [];
    }
    get() {
        return Promise.resolve(this._data);
    }
    write(data) {
        if (!data) {
            return Promise.reject('Invalid data to write');
        }
        this._data = data;
        return Promise.resolve();
    }
}
exports.MemoryStorage = MemoryStorage;
