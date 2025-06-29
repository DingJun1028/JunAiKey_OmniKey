// 繁中英碼, 矩陣圖說

import { SystemContext } from '../interfaces';
import { MemoirArchiver } from './services/memoirArchiver';
// import { LoggingService } from './logging/LoggingService';
// ... import other core services

/**
 * @function buildSystemContext
 * @description 負責建構並初始化完整的系統上下文 (SystemContext)。
 *              此函式集中處理所有核心服務的實例化與依賴注入，
 *              特別是處理服務間的循環依賴問題。
 *
 * This function is responsible for constructing and initializing the complete SystemContext.
 * It centralizes the instantiation and dependency injection of all core services,
 * especially handling circular dependencies between services.
 *
 * @returns {SystemContext} A fully initialized SystemContext object.
 */
export function buildSystemContext(): SystemContext {
  // 矩陣圖說：初始化流程
  // | 步驟 | 動作 (Action)                               | 目的 (Purpose)                                     |
  // | :--- | :------------------------------------------ | :------------------------------------------------- |
  // | 1    | 建立一個部分的、可擴充的 context 物件       | 作為所有服務實例共享的參考基礎。                   |
  // | 2    | 實例化需要 context 的核心服務 (如 MemoirArchiver) | 將 context 注入到服務中，讓它們能互相呼叫。        |
  // | 3    | 將新建立的服務實例加回 context 物件中       | 完成 context 的建構，使其包含所有核心服務。        |
  // | 4    | 回傳完整的 context 物件                     | 提供給應用程式的進入點 (main.tsx) 使用。           |

  // 步驟 1: 建立一個部分的 context 物件。
  // 我們暫時將其型別設為 any，以便動態地添加屬性。
  const partialContext: any = {
    currentUser: null, // 將在使用者登入後設定
    // 在此處初始化其他不需要完整 context 的服務
    // loggingService: new LoggingService(),
    // eventBus: new EventBus(),
    // ...etc
  };

  // 步驟 2: 實例化需要 context 的核心服務
  // 將 partialContext 傳入，解決循環依賴問題。
  const memoirArchiver = new MemoirArchiver(partialContext as SystemContext);
  // const wisdomSecretArt = new WisdomSecretArt(partialContext as SystemContext);

  // 步驟 3: 將新建立的服務實例加回 context 物件
  partialContext.memoirArchiver = memoirArchiver;
  // partialContext.wisdomSecretArt = wisdomSecretArt;

  // 步驟 4: 將物件轉型回完整的 SystemContext 並回傳
  const fullContext = partialContext as SystemContext;

  console.log('SystemContext has been successfully built and initialized.');
  return fullContext;
}