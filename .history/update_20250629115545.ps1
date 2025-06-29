# update.ps1
# 一鍵安裝、測試、build、同步、推送、部署腳本

Write-Host "=== [1/6] 安裝前端依賴 ==="
npm install

if (Test-Path "./junai-key-cli/package.json") {
    Write-Host "=== [2/6] 安裝 CLI 依賴 ==="
    Push-Location ./junai-key-cli
    npm install
    Pop-Location
}

if (Test-Path "./packages/@junai/sdk/package.json") {
    Write-Host "=== [3/6] 安裝 SDK 依賴 ==="
    Push-Location ./packages/@junai/sdk
    npm install
    Pop-Location
}

if (Test-Path "./supabase/functions/") {
    Write-Host "=== [4/6] 檢查 Supabase Edge Functions ==="
    # 可加上自動部署指令
}

Write-Host "=== [5/6] 前端 Build ==="
npm run build

if (Test-Path "./junai-key-cli/package.json") {
    Write-Host "=== [6/6] CLI Build ==="
    Push-Location ./junai-key-cli
    npm run build
    Pop-Location
}

if (Test-Path "./packages/@junai/sdk/package.json") {
    Write-Host "=== [7/6] SDK Build ==="
    Push-Location ./packages/@junai/sdk
    npm run build
    Pop-Location
}

Write-Host "=== [8/6] Git 同步推送 ==="
git add .
$commitMsg = Read-Host "請輸入 commit 訊息"
if (-not [string]::IsNullOrWhiteSpace($commitMsg)) {
    git commit -m $commitMsg
    git push
    Write-Host "✅ 已推送至遠端，CI/CD 將自動觸發（如有設置）"
} else {
    Write-Host "⚠️ 未輸入 commit 訊息，已取消 commit/push"
}

Write-Host "=== 完成！==="
