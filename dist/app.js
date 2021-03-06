"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var axios_1 = __importDefault(require("axios"));
var MtaAPI = /** @class */ (function () {
    function MtaAPI() {
        this.interval = false;
        this.baseDir = path.resolve(__dirname);
        this.builded = false;
        this.started = false;
        this.lastTime = 0;
        this.waitTime = 30000;
        this.requestStartsIn = 0;
        this.requestEndsIn = 0;
        this.debug = false;
        this.apiURL = 'https://mtasa.com/api/';
    }
    MtaAPI.prototype.getAll = function () {
        if (this.builded) {
            return this.data;
        }
        throw new Error('You should build first');
    };
    MtaAPI.prototype.getBy = function (opts) {
        var _a;
        if (opts === void 0) { opts = { ip: '', port: 0 }; }
        if (this.builded) {
            return (_a = this.data) === null || _a === void 0 ? void 0 : _a.filter(function (d) {
                if (!opts.port) {
                    return d.ip === opts.ip;
                }
                return d.ip === opts.ip && d.port === opts.port;
            });
        }
        throw new Error('You should build first');
    };
    MtaAPI.prototype.search = function (by) {
        var _this = this;
        var byKeys = Object.keys(by);
        var data = [];
        byKeys.forEach(function (key) {
            var _a;
            var temp = (_a = _this.data) === null || _a === void 0 ? void 0 : _a.filter(function (d) {
                // @ts-ignore
                if (d[key]) {
                    // @ts-ignore
                    return d[key].toLowerCase().includes(by[key].toLowerCase());
                }
                return false;
            });
            data.push({
                label: key,
                value: temp
            });
        });
        return data;
    };
    MtaAPI.prototype.setTick = function (seconds) {
        this.useDebug("In the next tick 'waitTime' will be updated to " + seconds + " seconds");
        this.waitTime = this.seconds2Time(seconds);
    };
    MtaAPI.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.started) return [3 /*break*/, 2];
                        this.started = true;
                        return [4 /*yield*/, this.startTick()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    MtaAPI.prototype.isBuilded = function () {
        return this.builded;
    };
    MtaAPI.prototype.time2Seconds = function (time) {
        return time / 1000;
    };
    MtaAPI.prototype.seconds2Time = function (seconds) {
        return seconds * 1000;
    };
    MtaAPI.prototype.lastRequestTime = function () {
        return ((this.requestEndsIn - this.requestStartsIn)) || 0;
    };
    MtaAPI.prototype.requestAll = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.requestStartsIn = Date.now();
            _this.useDebug('Requesting all...');
            axios_1.default.get(_this.apiURL)
                .then(function (response) {
                var data = response.data;
                _this.useDebug('Request all ends');
                _this.requestEndsIn = Date.now();
                _this.useDebug("Request time: " + _this.time2Seconds(_this.lastRequestTime()));
                resolve(_this.buildServerInfo(data));
            })
                .catch(function (e) {
                _this.buildError(e);
                reject(e);
            });
        });
    };
    MtaAPI.prototype.startTick = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.interval) {
                            clearInterval(this.interval);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!!this.existsJSON()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.buildData()];
                    case 2:
                        _a.sent();
                        this.builded = true;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.readJSON()];
                    case 4:
                        _a.sent();
                        this.builded = true;
                        _a.label = 5;
                    case 5:
                        this.interval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.buildData()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        }); }); }, this.waitTime);
                        this.useDebug("Tick started with " + this.time2Seconds(this.waitTime) + " seconds");
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        this.buildError(e_1);
                        throw e_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MtaAPI.prototype.buildData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.requestAll()];
                    case 1:
                        _a.sent();
                        if (!this.existsJSON()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.readJSON()];
                    case 2:
                        _a.sent();
                        if (this.checkToGenerateNewJSON()) {
                            this.writeJSON(this.data);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        this.writeJSON(this.data);
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        throw new Error(e_2);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MtaAPI.prototype.checkToGenerateNewJSON = function () {
        var time = Date.now() - this.lastTime;
        this.useDebug("JSON file was generated at " + this.time2Seconds(time) + " seconds ago");
        return this.time2Seconds(time) >= this.waitTime;
    };
    MtaAPI.prototype.writeJSON = function (data) {
        var _this = this;
        if (!data) {
            return false;
        }
        try {
            this.useDebug('Starting to write JSON');
            var toWrite = JSON.stringify({
                time: Date.now(),
                data: data
            });
            fs.writeFile(path.resolve(this.baseDir, 'servers.json'), toWrite, 'utf8', function (err) {
                if (err) {
                    _this.buildError(err);
                    _this.useDebug("Can't write servers.json file");
                }
                else {
                    _this.useDebug('servers.json writed');
                }
            });
        }
        catch (e) {
            this.buildError(e);
            return false;
        }
    };
    MtaAPI.prototype.readJSON = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.useDebug('Starting to read JSON File');
            var stream = fs.readFile(path.resolve(path.resolve(_this.baseDir, 'servers.json')), 'utf-8', function (err, data) {
                if (err) {
                    _this.buildError(err);
                    reject(err);
                }
                else {
                    try {
                        var tempData = JSON.parse(data);
                        _this.useDebug('JSON File readed');
                        _this.data = tempData.data;
                        _this.lastTime = tempData.time;
                        resolve();
                    }
                    catch (e) {
                        _this.writeJSON(_this.data);
                        _this.buildError(e);
                        reject(e);
                    }
                }
            });
        });
    };
    MtaAPI.prototype.existsJSON = function () {
        return fs.existsSync(path.resolve(this.baseDir, 'servers.json'));
    };
    MtaAPI.prototype.useDebug = function (data) {
        if (this.debug) {
            // tslint:disable-next-line:no-console
            console.log((new Date()).toLocaleDateString(), data);
        }
    };
    MtaAPI.prototype.buildServerInfo = function (data) {
        var temp = [];
        this.useDebug('Starting loop to mount IMTAServerInfo');
        data.forEach(function (value) {
            var dt = {
                name: value.name,
                ip: value.ip || '',
                maxplayers: value.maxplayers || 0,
                keep: value.keep === 1,
                playersCount: value.players || 0,
                version: value.version || '',
                requirePassword: value.password === 1,
                port: value.port || ''
            };
            temp.push(dt);
        });
        this.useDebug('Loop ends');
        this.data = temp;
        return this.data;
    };
    MtaAPI.prototype.buildError = function (error) {
        var type = 'default';
        var message = error.message || '';
        if (error.response) {
            type = 'request';
        }
        if (type === 'request') {
            message = error.response.data.message || error.response.statusText || 'not specified';
        }
        else {
            message = error.message || 'not specified';
        }
        this.error = {
            message: message,
            type: type
        };
        return false;
    };
    return MtaAPI;
}());
exports.default = MtaAPI;
