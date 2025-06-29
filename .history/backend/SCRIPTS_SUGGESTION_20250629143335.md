# 建議 package.json scripts
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "test": "jest",
    "sync": "node ./src/scripts/syncAll.js",
    "start": "node ./src/index.js"
  }
}
# 請依實際需求合併至 backend/package.json
