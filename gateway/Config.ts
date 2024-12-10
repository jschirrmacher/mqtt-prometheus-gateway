import { parse } from "yaml"
import { resolve } from "path"
import { readFile } from "fs/promises"
import { configKeys, Configuration } from "./types"

const defaultConfigFile = resolve(__dirname, "..", "config.yaml")
export default async function readConfig(configFile = defaultConfigFile) {
  const config = parse((await readFile(configFile)).toString()) as Configuration

  configKeys.forEach((key) => {
    if (process.env[key] !== undefined) {
      config[key] = process.env[key]
    }
  })

  return config
}
