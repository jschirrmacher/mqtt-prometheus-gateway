import { describe, expect, it } from "vitest"
import readConfig from "./Config"
import { resolve } from "path"

describe("Config", () => {
  it("should read config file", async () => {
    expect(await readConfig(resolve(__dirname, "config.test.yaml"))).toEqual({
      test: { data: [42, 4711] },
    })
  })
})
