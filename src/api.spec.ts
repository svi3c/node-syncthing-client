import { readFile } from "fs";
import { promisify } from "util";
import { Syncthing } from "./api";
import { Config } from "./api-types";

let apiKey1 = "";
let apiKey2 = "";

beforeAll(async () => {
  apiKey1 = await getApiKey("/st1/config/config.xml");
  apiKey2 = await getApiKey("/st2/config/config.xml");
});

describe("api", () => {
  let api1: Syncthing;
  let api2: Syncthing;
  let originalConfig1: Config;
  let originalConfig2: Config;
  beforeEach(async () => {
    api1 = new Syncthing("http://st1:8384", apiKey1);
    api2 = new Syncthing("http://st2:8384", apiKey2);
    originalConfig1 = await api1.system.getConfig();
    originalConfig2 = await api2.system.getConfig();
  });
  afterEach(async () => {
    await api1.system.setConfig(originalConfig1);
    await api2.system.setConfig(originalConfig2);
  });
  describe("system", () => {
    describe("browse()", () => {
      it("should browse the given directory for subdirectories", async () => {
        expect(await api1.system.browse("/var/syncthing/")).toEqual([
          "/var/syncthing/Sync/",
          "/var/syncthing/config/",
        ]);
      });
    });
    describe("getConfig()", () => {
      it("should return the current config", async () => {
        expect((await api1.system.getConfig()).gui.apiKey).toEqual(apiKey1);
      });
    });
    describe("setConfig()", () => {
      it("should update the current config", async () => {
        const config = await api1.system.getConfig();

        await api1.system.setConfig({
          ...config,
          devices: [
            { ...config.devices[0], paused: !config.devices[0].paused },
            ...config.devices.slice(1),
          ],
        });

        expect((await api1.system.getConfig()).devices[0].paused).not.toEqual(
          config.devices[0].paused
        );
      });
    });
    describe("isConfigInSync()", () => {
      it("should return whether the config is insync", async () => {
        expect(await api1.system.isConfigInsync()).toEqual(true);
      });
    });
    describe("getConnections()", () => {
      it("should retrieve current connections", async () => {
        expect(
          Object.keys((await api1.system.getConnections()).connections).length
        ).toEqual(1);
      });
    });
    describe("getDebug()", () => {
      it("should retrieve current debug configuration", async () => {
        expect(await api1.system.getDebug()).toEqual({
          enabled: expect.any(Array),
          facilities: expect.any(Object),
        });
      });
    });
    describe("setDebug()", () => {
      xit("should retrieve current connections", async () => {
        console.log(await api1.system.setDebug(["config", "db"], []));
        const debug = await api1.system.getDebug();
        console.log(debug);
        expect(debug.enabled).toEqual(["config", "db"]);
        // await api1.system.setDebug([], ["config", "db"]);
        // expect((await api1.system.getDebug()).enabled).toEqual([]);
      });
    });
    describe("getDiscovery()", () => {
      it("should retrieve current discovery", async () => {
        const result = await api1.system.getDiscovery();
        Object.values(result).forEach(({ addresses }) => {
          expect(addresses.every((addr) => typeof addr === "string"));
        });
      });
    });
  });
});

async function getApiKey(path: string) {
  const content = await promisify(readFile)(path, "utf8");
  return content.match(/<apikey>(.*)<\/apikey>/)[1];
}
