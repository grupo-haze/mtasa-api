"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const parse_json_1 = __importDefault(require("parse-json"));
const ms_converter_1 = require("ms-converter");
const debug_1 = __importDefault(require("debug"));
const MtaAPI_1 = require("./MtaAPI");
const errors_1 = require("./errors");
class APIRequest {
    constructor(instance) {
        this.log = (0, debug_1.default)(MtaAPI_1.MtaAPI.name).extend(APIRequest.name);
        this.url = 'https://mtasa.com/api';
        this.timeout = (0, ms_converter_1.ms)(6, 'seconds');
        this.instance = instance || axios_1.default.create({
            baseURL: this.url,
            timeout: this.timeout,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    async find() {
        var _a;
        this.log('requesting data');
        const request = await this.instance.get('/');
        let data = request.data;
        if (typeof request.data === 'string') {
            try {
                data = (0, parse_json_1.default)(request.data);
            }
            catch (e) {
                throw new errors_1.InvalidAPIResponseException(request.data, e);
            }
        }
        this.log('response : ', (_a = request.data) === null || _a === void 0 ? void 0 : _a.length);
        if (!data || !(data === null || data === void 0 ? void 0 : data.length)) {
            throw new errors_1.OfflineAPIException();
        }
        return data;
    }
    setTimeout(timeout) {
        this.timeout = timeout;
        return this;
    }
}
exports.APIRequest = APIRequest;
