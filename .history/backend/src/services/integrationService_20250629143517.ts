import { GithubProxy } from '../proxies/GithubProxy';
import { CapacitiesProxy } from '../proxies/CapacitiesProxy';
// import { BoostSpaceProxy } from '../proxies/BoostSpaceProxy';

export class IntegrationService {
  private github: GithubProxy;
  private capacities: CapacitiesProxy;
  // private boostSpace: BoostSpaceProxy;

  constructor(env: { GITHUB_PAT: string, CAPACITIES_TOKEN?: string }) {
    this.github = new GithubProxy(env.GITHUB_PAT);
    this.capacities = new CapacitiesProxy(env.CAPACITIES_TOKEN || '');
    // this.boostSpace = new BoostSpaceProxy(env.BOOSTSPACE_TOKEN);
  }

  async getGithubFileContent(owner: string, repo: string, path: string, ref = 'main') {
    return this.github.fetchFile(owner, repo, path, ref);
  }

  async getCapacitiesData(endpoint: string) {
    return this.capacities.fetchData(endpoint);
  }

  // 可擴充多平台 API 整合方法
}
