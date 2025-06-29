"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orchestrator = void 0;
var AuthorityForgeEngine_1 = require("./AuthorityForgeEngine");
var RuneEngravingSystem_1 = require("./RuneEngravingSystem");
var Orchestrator = /** @class */ (function () {
    function Orchestrator() {
        this.authorityForge = new AuthorityForgeEngine_1.AuthorityForgeEngine();
        this.runeEngraving = new RuneEngravingSystem_1.RuneEngravingSystem();
    }
    /**
     * 根據 action 分配到不同引擎
     * @param task RouteTask 任務物件
     * @returns string 對應子系統名稱
     */
    Orchestrator.prototype.route = function (task) {
        switch (task.action) {
            case 'forgeAuthority':
                return 'AuthorityForgeEngine';
            case 'engraveRune':
                return 'RuneEngravingSystem';
            case 'navigate':
                return 'NavigationAgent';
            case 'memory':
                return 'MemoryPalace';
            default:
                return 'Unknown';
        }
    };
    /**
     * 根據 action 分配到不同引擎並執行對應操作
     * @param task RouteTask 任務物件
     * @returns unknown 執行結果
     */
    Orchestrator.prototype.dispatch = function (task) {
        switch (task.action) {
            case 'forgeAuthority': {
                var payload = task.payload;
                return this.authorityForge.forgeAuthority(payload.type, payload.permissions);
            }
            case 'getAuthorityById': {
                var payload = task.payload;
                return this.authorityForge.getAuthorityById(payload.id);
            }
            case 'removeAuthority': {
                var payload = task.payload;
                return this.authorityForge.removeAuthority(payload.id);
            }
            case 'forgeModule': {
                var payload = task.payload;
                return this.authorityForge.forgeModule(payload.ids, payload.moduleType);
            }
            case 'engraveRune': {
                var payload = task.payload;
                return this.runeEngraving.engraveRune(payload.name, payload.effect);
            }
            case 'getAllRunes':
                return this.runeEngraving.getAllRunes();
            default:
                return 'Unknown action';
        }
    };
    return Orchestrator;
}());
exports.Orchestrator = Orchestrator;
