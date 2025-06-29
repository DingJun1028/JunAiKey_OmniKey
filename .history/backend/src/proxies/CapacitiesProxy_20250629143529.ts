import { Octokit } from '@octokit/core';

export class CapacitiesProxy {
  constructor(private token: string) {}
  // 實作 Capacities API 認證與請求
  async fetchData(endpoint: string) {
    // TODO: 根據 Capacities API 文件實作
    throw new Error('Not implemented');
  }
}

export class BoostSpaceProxy {
  constructor(private token: string) {}
  // 實作 Boost.space API 認證與請求
  async fetchData(endpoint: string) {
    // TODO: 根據 Boost.space API 文件實作
    throw new Error('Not implemented');
  }
}
