import { Octokit } from '@octokit/core';

export class GithubProxy {
  private octokit: Octokit;
  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async fetchFile(owner: string, repo: string, path: string, ref = 'main') {
    try {
      const res = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        ref,
      });
      if (res.status === 200 && res.data && 'content' in res.data) {
        return Buffer.from(res.data.content, 'base64').toString('utf-8');
      }
      throw new Error('File not found or invalid response');
    } catch (err) {
      // 可擴充日誌與錯誤處理
      throw err;
    }
  }
}

// 可依需求擴充 CapacitiesProxy、BoostSpaceProxy 等多平台代理
