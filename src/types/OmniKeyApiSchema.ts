/**
 * Represents the structure for the OmniKey System API Database Table (Universal Runes).
 */
interface OmniKeyApiRune {
  name: string; // 符文名稱（API 名稱）
  auth_type: string; // 認證方式（如 Token、JWT、OAuth）
  endpoint_base: string; // API 網域或主結構 URL
  methods_supported: string; // GET / POST / Webhook 支援類型
  rate_limit: string; // 流量限制說明
  metadata_keys: string[]; // 支援的 meta 欄位（如 note_id, agent_source）
  sync_direction: "unidirectional" | "bidirectional"; // 單向 / 雙向同步
  agent_type: "controller" | "executor" | "logger"; // 所屬代理類別（主控 / 執行 / 記錄）
}