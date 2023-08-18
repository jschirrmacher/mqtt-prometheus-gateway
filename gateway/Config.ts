import { parse } from "yaml"
import { resolve } from "path"
import { readFile } from "fs/promises"
import { MetricsConfiguration } from "./types"

const defaultConfigFile = resolve(__dirname, "..", "config.yaml")
export default async function readConfig(configFile = defaultConfigFile) {
  return parse((await readFile(configFile)).toString()) as MetricsConfiguration
}
