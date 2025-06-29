import { AuthorityForgeEngine } from './AuthorityForgeEngine';
import { RuneEngravingSystem } from './RuneEngravingSystem';
export class Orchestrator {
    constructor() {
        this.authorityForge = new AuthorityForgeEngine();
        this.runeEngraving = new RuneEngravingSystem();
    }
    /**
     * 根據 action 分配到不同引擎
     * @param task RouteTask 任務物件
     * @returns string 對應子系統名稱
     */
    route(task) {
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
    }
    /**
     * 根據 action 分配到不同引擎並執行對應操作
     * @param task RouteTask 任務物件
     * @returns unknown 執行結果
     */
    dispatch(task) {
        switch (task.action) {
            case 'forgeAuthority': {
                const payload = task.payload;
                return this.authorityForge.forgeAuthority(payload.type, payload.permissions);
            }
            case 'getAuthorityById': {
                const payload = task.payload;
                return this.authorityForge.getAuthorityById(payload.id);
            }
            case 'removeAuthority': {
                const payload = task.payload;
                return this.authorityForge.removeAuthority(payload.id);
            }
            case 'forgeModule': {
                const payload = task.payload;
                return this.authorityForge.forgeModule(payload.ids, payload.moduleType);
            }
            case 'engraveRune': {
                const payload = task.payload;
                return this.runeEngraving.engraveRune(payload.name, payload.effect);
            }
            case 'getAllRunes':
                return this.runeEngraving.getAllRunes();
            default:
                return 'Unknown action';
        }
    }
}
