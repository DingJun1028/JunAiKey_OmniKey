import { GithubProxy } from '../proxies/GithubProxy';
import { CapacitiesProxy } from '../proxies/CapacitiesProxy';
import { InfoflowProxy, StraicoAIProxy, AitableProxy, GoogleCloudProxy } from '../proxies/MultiPlatformProxies';
// import { BoostSpaceProxy } from '../proxies/BoostSpaceProxy';

export class IntegrationService {
  private github: GithubProxy;
  private capacities: CapacitiesProxy;
  private infoflow: InfoflowProxy;
  private straico: StraicoAIProxy;
  private aitable: AitableProxy;
  private gcp: GoogleCloudProxy;
  // private boostSpace: BoostSpaceProxy;

  constructor(env: {
    GITHUB_PAT: string,
    CAPACITIES_TOKEN?: string,
    INFOFLOW_TOKEN?: string,
    STRAICO_TOKEN?: string,
    AITABLE_TOKEN?: string,
    GCP_TOKEN?: string
  }) {
    this.github = new GithubProxy(env.GITHUB_PAT);
    this.capacities = new CapacitiesProxy(env.CAPACITIES_TOKEN || '');
    this.infoflow = new InfoflowProxy(env.INFOFLOW_TOKEN || '');
    this.straico = new StraicoAIProxy(env.STRAICO_TOKEN || '');
    this.aitable = new AitableProxy(env.AITABLE_TOKEN || '');
    this.gcp = new GoogleCloudProxy(env.GCP_TOKEN || '');
    // this.boostSpace = new BoostSpaceProxy(env.BOOSTSPACE_TOKEN);
  }

  async getGithubFileContent(owner: string, repo: string, path: string, ref = 'main') {
    return this.github.fetchFile(owner, repo, path, ref);
  }

  async getCapacitiesData(endpoint: string) {
    return this.capacities.fetchData(endpoint);
  }

  async getInfoflowData(endpoint: string) {
    return this.infoflow.fetchData(endpoint);
  }

  async getStraicoData(endpoint: string) {
    return this.straico.fetchData(endpoint);
  }

  async getAitableData(endpoint: string) {
    return this.aitable.fetchData(endpoint);
  }

  async getGCPData(endpoint: string) {
    return this.gcp.fetchData(endpoint);
  }

  // 可擴充多平台 API 整合方法
}
