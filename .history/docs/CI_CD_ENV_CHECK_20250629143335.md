# CI/CD env 檢查步驟建議

- 在 .github/workflows/ci-cd-monorepo.yml 或 deploy.yml 增加如下步驟：

```yaml
- name: Check required env
  run: |
    if [ -z "$GITHUB_PAT" ]; then echo "❌ GITHUB_PAT 未設置，請於 GitHub Secrets 設定"; exit 1; fi
    if [ -z "$SUPABASE_URL" ]; then echo "❌ SUPABASE_URL 未設置"; exit 1; fi
    # 依需求檢查其他必要變數
```

- 部署前自動注入 Secrets，確保安全。
- 於 README.md 補充 CI/CD 相關說明。
