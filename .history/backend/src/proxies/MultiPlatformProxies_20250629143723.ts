import { Octokit } from '@octokit/core';

export class InfoflowProxy {
  constructor(private token: string) {}
  // 實作 Infoflow API 認證與請求
  async fetchData(endpoint: string) {
    // TODO: 根據 Infoflow API 文件實作
    throw new Error('Not implemented');
  }
}

export class StraicoAIProxy {
  constructor(private token: string) {}
  // 實作 Straico AI API 認證與請求
  async fetchData(endpoint: string) {
    // TODO: 根據 Straico AI API 文件實作
    throw new Error('Not implemented');
  }
}

export class AitableProxy {
  constructor(private token: string) {}
  // 實作 Aitable API 認證與請求
  async fetchData(endpoint: string) {
    // TODO: 根據 Aitable API 文件實作
    throw new Error('Not implemented');
  }
}

export class GoogleCloudProxy {
  constructor(private token: string) {}
  // 實作 Google Cloud Platform API 認證與請求
  async fetchData(endpoint: string) {
    // TODO: 根據 GCP API 文件實作
    throw new Error('Not implemented');
  }
}
