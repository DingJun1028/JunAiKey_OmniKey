import { AuthorityForgeEngine } from './AuthorityForgeEngine'
import { RuneEngravingSystem } from './RuneEngravingSystem'

/**
 * 路由分配器（Orchestrator）
 * 負責根據 action 分配任務至對應子系統。
 */
export interface RouteTask {
  userId: string;
  action: string;
  payload: unknown;
}

export class Orchestrator {
  private authorityForge = new AuthorityForgeEngine()
  private runeEngraving = new RuneEngravingSystem()

  /**
   * 根據 action 分配到不同引擎
   * @param task RouteTask 任務物件
   * @returns string 對應子系統名稱
   */
  route(task: RouteTask): string {
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
   * @returns any 執行結果
   */
  dispatch(task: RouteTask): any {
    switch (task.action) {
      case 'forgeAuthority':
        // payload: { type: string, permissions: string[] }
        return this.authorityForge.forgeAuthority(
          (task.payload as any).type,
          (task.payload as any).permissions
        )
      case 'getAuthorityById':
        return this.authorityForge.getAuthorityById((task.payload as any).id)
      case 'removeAuthority':
        return this.authorityForge.removeAuthority((task.payload as any).id)
      case 'forgeModule':
        return this.authorityForge.forgeModule(
          (task.payload as any).ids,
          (task.payload as any).moduleType
        )
      case 'engraveRune':
        // payload: { name: string, effect: string }
        return this.runeEngraving.engraveRune(
          (task.payload as any).name,
          (task.payload as any).effect
        )
      case 'getAllRunes':
        return this.runeEngraving.getAllRunes()
      default:
        return 'Unknown action'
    }
  }
}
