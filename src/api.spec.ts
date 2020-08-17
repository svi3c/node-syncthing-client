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
        Object.values(result).forEach(({ addresses }) =>
          expect(addresses.every((addr) => typeof addr === "string"))
        );
      });
    });
    describe("errors", () => {
      it("should add, read and clear errors", async () => {
        expect(await api1.system.getErrors()).toEqual({ errors: null });
        await api1.system.addError("Some error");
        expect(await api1.system.getErrors()).toEqual({
          errors: [
            { message: "Some error", level: 3, when: expect.any(String) },
          ],
        });
        await api1.system.clearErrors();
        expect(await api1.system.getErrors()).toEqual({ errors: null });
      });
    });
    describe("getLogs()", () => {
      it("should retrieve recent logs", async () => {
        const result = await api1.system.getLogs();
        expect(
          result.messages.every(
            ({ level, message, when }) =>
              typeof level === "number" &&
              typeof message === "string" &&
              typeof when === "string"
          )
        );
      });
    });
    describe("pause()", () => {
      it("should fail on wrong id", async () => {
        expect.assertions(2);
        try {
          await api1.system.pause("wrong-id");
        } catch (e) {
          expect(e.body).toMatch("device ID invalid");
          expect(e.statusCode).toEqual(500);
        }
      });
      it("should pause itself", async () => {
        const id = (await api1.system.getConfig()).devices[0].deviceID;
        await api1.system.pause(id);
      });
    });
    describe("ping()", () => {
      it("should return a ping response", async () => {
        expect(await api1.system.ping()).toEqual({ ping: "pong" });
      });
    });
    describe("resume()", () => {
      it("should fail on wrong id", async () => {
        expect.assertions(2);
        try {
          await api1.system.resume("wrong-id");
        } catch (e) {
          expect(e.body).toMatch("device ID invalid");
          expect(e.statusCode).toEqual(500);
        }
      });
      it("should resume itself", async () => {
        const id = (await api1.system.getConfig()).devices[0].deviceID;
        await api1.system.resume(id);
      });
    });
    describe("getStatus()", () => {
      it("should retrieve the system status", async () => {
        const id = (await api1.system.getConfig()).devices[0].deviceID;
        expect(await api1.system.getStatus()).toEqual(
          expect.objectContaining({
            myID: id,
          })
        );
      });
    });
    xdescribe("getUpgrade()", () => {
      it("should retrieve the upgrade status", async () => {
        expect(await api1.system.getUpgrade()).toEqual(
          expect.objectContaining({
            running: "v123",
          })
        );
      });
    });
    describe("getVersion()", () => {
      it("should retrieve the current version", async () => {
        expect(await api1.system.getVersion()).toEqual(
          expect.objectContaining({
            os: "linux",
          })
        );
      });
    });
  });
});

async function getApiKey(path: string) {
  const content = await promisify(readFile)(path, "utf8");
  return content.match(/<apikey>(.*)<\/apikey>/)[1];
}
