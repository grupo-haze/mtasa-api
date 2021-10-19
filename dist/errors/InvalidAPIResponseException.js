"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidAPIResponseException = void 0;
class InvalidAPIResponseException extends Error {
    constructor(data, parentError) {
        super('MTA request failed');
        this.data = data;
        this.parentError = parentError;
    }
}
exports.InvalidAPIResponseException = InvalidAPIResponseException;
