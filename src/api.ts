import {
  Config,
  Connection,
  Debug,
  SyncthingEvent,
  SyncthingEventFromType,
  TotalConnections,
} from "./api-types";
import { get, post } from "./request";

class Api {
  constructor(private url: string, private apiToken: string) {}
  protected _get<T>(path: string, params?: {}) {
    return get<T>(`${this.url}/rest${path}`, {
      headers: { "X-API-Key": this.apiToken },
      params,
    }).then((res) => res.body);
  }
  protected _post<T>(path: string, body?: any, params?: {}) {
    return post<T>(`${this.url}/rest${path}`, body, {
      headers: { "X-API-Key": this.apiToken },
      params,
    }).then((res) => res.body);
  }
}

class System extends Api {
  browse(cwd?: string) {
    return this._get<string[]>("/system/browse", { current: cwd });
  }

  getConfig() {
    return this._get<Config>("/system/config");
  }

  setConfig(config: Config) {
    return this._post<void>("/system/config", config);
  }

  isConfigInsync() {
    return this._get<{ configInSync: boolean }>("/system/config/insync").then(
      ({ configInSync }) => configInSync
    );
  }

  getConnections() {
    return this._get<{
      connections: { [id: string]: Connection };
      total: TotalConnections;
    }>("/system/connections");
  }

  getDebug() {
    return this._get<Debug>("/system/debug");
  }

  setDebug(enable: string[], disable: string[] = []) {
    return this._get<Debug>("/system/debug", {
      disable,
      enable,
    });
  }

  getDiscovery() {
    return this._get<{ [id: string]: { addresses: string[] } }>(
      "/system/discovery"
    );
  }
}

export class Syncthing {
  system = new System(this._url, this._apiToken);

  constructor(private _url: string, private _apiToken: string) {}

  systemBrowse(cwd?: string) {
    this._get("/system/browse", { current: cwd });
  }

  async watch<
    T extends SyncthingEvent["type"],
    E extends SyncthingEventFromType<T>
  >(events: T[], fn: (e: SyncthingEventFromType<T>) => void) {
    const params = { events: events.length > 0 ? events.join(",") : "" };
    let aborted = false;
    let since =
      (
        await this._get<E[]>("/events", {
          ...params,
          limit: 1,
          timeout: 0,
        })
      ).body[0]?.id || 0;
    const poll = () =>
      this._get<E[]>("/events", {
        ...params,
        since,
      }).then(({ body: items }) => {
        if (!aborted) {
          if (items.length > 0) {
            items.forEach(fn);
            since = items[items.length - 1].id;
          }
          poll();
        }
      });
    return () => (aborted = true);
  }

  private _get<T>(path: string, params?: {}) {
    return get<T>(`${this._url}/rest${path}`, {
      headers: { "X-API-Key": this._apiToken },
      params,
    });
  }
}
