# 多平台代理模式設計圖

```
[Client]
   |
   v
[IntegrationService] --(呼叫)--> [GithubProxy]
   |                                 |
   |                                 v
   |                        [GitHub API]
   |
   |--(呼叫)--> [CapacitiesProxy] --(API)--> [Capacities]
   |
   |--(呼叫)--> [BoostSpaceProxy] --(API)--> [Boost.space]
   ...
```

- IntegrationService 負責業務整合與代理調度
- 各 Proxy 專責平台 API 認證、請求、錯誤處理
- 支援多平台擴充與動態切換
