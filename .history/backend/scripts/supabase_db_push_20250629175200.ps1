# 一鍵自動化：Supabase 資料庫結構推送腳本
# 使用方式：在專案根目錄 PowerShell 執行 ./backend/scripts/supabase_db_push.ps1

# 0. 參數設定
$ErrorActionPreference = 'Stop'
$projectRef = $env:SUPABASE_PROJECT_REF
if (-not $projectRef) {
    Write-Host '請先設定環境變數 SUPABASE_PROJECT_REF 或手動輸入 Project Ref：'
    $projectRef = Read-Host '請輸入 Supabase Project Ref (如 abcdefghijklmnop)'
}

# 1. 安裝 Supabase CLI（如未安裝）
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host '未偵測到 supabase-cli，開始安裝...'
    npm install -g supabase-cli
}

# 2. 登入 Supabase（如未登入）
try {
    $loginStatus = supabase projects list 2>&1
} catch {
    Write-Host '尚未登入 Supabase，請登入...'
    supabase login
}

# 3. 連結本地專案與雲端專案
supabase link --project-ref $projectRef

# 4. 推送 migrations 目錄所有 SQL 結構到雲端
supabase db push

Write-Host '✅ Sacred Codex 資料表結構已自動推送至雲端！'
Write-Host '請至 Supabase Table Editor 驗證 developer_memoirs 結構與索引。'
