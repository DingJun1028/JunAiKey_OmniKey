"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCloudProxy = exports.AitableProxy = exports.StraicoAIProxy = exports.InfoflowProxy = void 0;
var InfoflowProxy = /** @class */ (function () {
    function InfoflowProxy(token) {
        this.token = token;
    }
    // 實作 Infoflow API 認證與請求
    InfoflowProxy.prototype.fetchData = function (endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: 根據 Infoflow API 文件實作
                throw new Error('Not implemented');
            });
        });
    };
    return InfoflowProxy;
}());
exports.InfoflowProxy = InfoflowProxy;
var StraicoAIProxy = /** @class */ (function () {
    function StraicoAIProxy(token) {
        this.token = token;
    }
    // 實作 Straico AI API 認證與請求
    StraicoAIProxy.prototype.fetchData = function (endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: 根據 Straico AI API 文件實作
                throw new Error('Not implemented');
            });
        });
    };
    return StraicoAIProxy;
}());
exports.StraicoAIProxy = StraicoAIProxy;
var AitableProxy = /** @class */ (function () {
    function AitableProxy(token) {
        this.token = token;
    }
    // 實作 Aitable API 認證與請求
    AitableProxy.prototype.fetchData = function (endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: 根據 Aitable API 文件實作
                throw new Error('Not implemented');
            });
        });
    };
    return AitableProxy;
}());
exports.AitableProxy = AitableProxy;
var GoogleCloudProxy = /** @class */ (function () {
    function GoogleCloudProxy(token) {
        this.token = token;
    }
    // 實作 Google Cloud Platform API 認證與請求
    GoogleCloudProxy.prototype.fetchData = function (endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: 根據 GCP API 文件實作
                throw new Error('Not implemented');
            });
        });
    };
    return GoogleCloudProxy;
}());
exports.GoogleCloudProxy = GoogleCloudProxy;
