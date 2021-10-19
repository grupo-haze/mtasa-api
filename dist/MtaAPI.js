"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MtaAPI = void 0;
const debug_1 = __importDefault(require("debug"));
const ms_converter_1 = require("ms-converter");
const storage_1 = require("./storage");
const APIRequest_1 = require("./APIRequest");
const errors_1 = require("./errors");
class MtaAPI {
    constructor(storage = new storage_1.MemoryStorage(), request = new APIRequest_1.APIRequest()) {
        this.storage = storage;
        this.request = request;
        this.log = (0, debug_1.default)(MtaAPI.name);
        this.delayTime = (0, ms_converter_1.ms)(10, 'seconds');
        this.lastRequestTime = 0;
        this.interval = false;
        this.searchFunction = (data, objectKey, objectValue) => data[objectKey].toString().toLowerCase().includes(objectValue.toString().toLowerCase());
        this.debug = false;
    }
    // Get all data
    // PS: if instance is stoped, back to update
    async getAll() {
        this.log('getting all');
        await this.start();
        const data = await this.storage.get();
        this.log('get : ok');
        return data;
    }
    async getBy(opts = { ip: '', port: 0 }) {
        return (await this.getAll()).filter((server) => {
            if (!opts.port) {
                return server.ip === opts.ip;
            }
            return server.ip === opts.ip && server.port === opts.port;
        });
    }
    async search(by) {
        const keys = Object.keys(by);
        const data = await this.getAll();
        return data.filter((server) => keys.map((key) => this.searchFunction(server, key, by[key])));
    }
    async update() {
        await this.createData(this.log.extend(this.update.name));
    }
    // Stop getting update data
    stop() {
        clearInterval(this.interval);
    }
    // Delay time to update new data
    setDelay({ seconds }) {
        this.useDebug(`In the next tick 'waitTime' will be updated to ${seconds} seconds`);
        this.delayTime = (0, ms_converter_1.ms)(seconds, 'seconds');
        return this;
    }
    // Time of last request executed
    lastRequest() {
        return new Date(this.lastRequestTime);
    }
    async start() {
        const log = this.log.extend(this.start.name);
        return new Promise((resolve) => {
            log('has interval', !!this.interval);
            if (!this.interval) {
                log('creating new interval');
                this.interval = setInterval(() => this.createData(log), this.delayTime);
                log('requesting initial data...');
                this.createData(log)
                    .then(() => resolve());
            }
            else {
                resolve();
            }
        });
    }
    async createData(log) {
        try {
            log('requesting api...');
            const apiData = await this.request.find();
            log('request ends');
            const data = this.buildServerInfo(apiData);
            log('setting data');
            await this.storage.write(data);
            this.lastRequestTime = Date.now();
            return data;
        }
        catch (error) {
            if (error instanceof errors_1.OfflineAPIException || error instanceof errors_1.InvalidAPIResponseException) {
                this.log('API Offline or Invalid !');
                const currentData = await this.storage.get();
                if (!currentData || !Array.isArray(currentData)) {
                    this.log('writing empty data...');
                    await this.storage.write([]);
                }
                return [];
            }
            throw error;
        }
    }
    useDebug(data) {
        if (this.debug) {
            // tslint:disable-next-line:no-console
            console.log((new Date()).toLocaleDateString(), data);
        }
    }
    buildServerInfo(data) {
        this.useDebug('Starting loop to mount IMTAServerInfo');
        const builded = data.map((raw) => {
            const dt = {
                name: this.serverName(raw.name),
                ip: raw.ip || '',
                maxPlayers: raw.maxplayers || 0,
                keep: raw.keep === 1,
                playersCount: raw.players || 0,
                version: raw.version || '',
                requirePassword: raw.password === 1,
                port: raw.port || -1
            };
            return dt;
        });
        this.useDebug('Loop ends');
        return builded;
    }
    serverName(raw) {
        const str = Buffer.from(raw).toString('utf8');
        try {
            return decodeURIComponent(escape(str));
        }
        catch (e) {
            return str;
        }
    }
}
exports.MtaAPI = MtaAPI;
