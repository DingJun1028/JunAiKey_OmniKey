// 繁中英碼, 矩陣圖說

import { ActionIntent, SystemContext } from '../../interfaces'; // 引入 SystemContext 與 ActionIntent
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

/**
 * @interface MemoirEntry
 * @description 定義單筆回憶錄的結構
 * Defines the structure for a single memoir entry.
 */
export interface MemoirEntry {
  actor: 'user' | 'assistant'; // 發言者角色
  content: string;             // 發言內容
  // --- (進化) 新增語意化欄位 ---
  actionIntent?: ActionIntent; // AI 的決策意圖
  executionResult?: any;       // 動作的執行結果 (成功或失敗)
  metadata?: Record<string, any>; // 其他元數據
}

/**
 * @class MemoirArchiver
 * @description 負責將開發者回憶錄存檔至 Supabase
 * Handles the archiving of developer memoirs to Supabase.
 */
export class MemoirArchiver {
  private context: SystemContext;
  private supabase: SupabaseClient;

  /**
   * @constructor
   * @description 初始化 Supabase 客戶端並接收系統上下文
   * Initializes the Supabase client and receives the system context.
   */
  constructor(context: SystemContext) {
    this.context = context;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Supabase URL or Service Role Key is not defined in environment variables.');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  }

  /**
   * @method archiveTurn
   * @description 存檔單次對話，並進行智慧沉澱與標籤生成
   * Archives a single conversation turn, performing wisdom precipitation and tag generation.
   * @param sessionId - 本次對話的 Session ID.
   * @param turnIndex - 本次對話在 Session 中的順序.
   * @param entry - 要存檔的單筆對話紀錄.
   * @returns {Promise<void>}
   */
  public async archiveTurn(
    sessionId: string,
    turnIndex: number,
    entry: MemoirEntry & {
      source?: string;
      user_id?: string; // uuid 型別
      status?: string;
      embedding?: number[] | null; // AI 向量
    }
  ): Promise<void> {
    // 智慧沉澱 (摘要/標籤)
    const contentToAnalyze = `User: ${entry.actor === 'user' ? entry.content : ''}\nAssistant: ${entry.actor === 'assistant' ? entry.content : ''}\nAction: ${entry.actionIntent?.action}`;
    const summary = `Turn ${turnIndex}: User and assistant discussed... Action taken was '${entry.actionIntent?.action || 'none'}'.`;
    const autoTags = ['conversation', entry.actor];
    if (entry.actionIntent) {
      autoTags.push(`action:${entry.actionIntent.action}`);
      if (entry.executionResult?.error) {
        autoTags.push('status:failed');
      } else {
        autoTags.push('status:success');
      }
    }
    // 狀態自動判斷
    const status = entry.status || (entry.executionResult?.error ? 'pending' : 'actioned');
    // 來源自動判斷
    const source = entry.source || (typeof window !== 'undefined' && window?.acquireVsCodeApi ? 'vscode' : 'api');
    // 多用戶支援 (uuid)
    const user_id = entry.user_id || this.context.currentUser?.id || process.env.JUNAIKEY_USER_ID || null;
    // embedding 欄位預留（如有 AI 向量）
    const embedding = entry.embedding ?? null;
    // updated_at
    const updated_at = new Date().toISOString();
    // created_at
    const created_at = new Date().toISOString();

    // 欄位順序與 SQL schema 完全一致
    const recordToInsert = {
      id: uuidv4(), // 若需自訂 id，可移除此行
      session_id: sessionId,
      turn_index: turnIndex,
      actor: entry.actor,
      content: entry.content,
      action_intent: entry.actionIntent || {},
      execution_result: entry.executionResult || {},
      auto_tags: autoTags,
      summary: summary,
      metadata: entry.metadata || {},
      source,
      user_id,
      status,
      embedding,
      updated_at,
      created_at,
    };
    // 僅保留 schema 欄位，移除 undefined
    Object.keys(recordToInsert).forEach(k => recordToInsert[k] === undefined && delete recordToInsert[k]);
    const { error } = await this.supabase.from('developer_memoirs').insert(recordToInsert);
    if (error) {
      console.error('Failed to archive memoir to Supabase:', error);
      throw error;
    }
    console.log(`Successfully archived turn ${turnIndex} for session ${sessionId}`);
  }
}