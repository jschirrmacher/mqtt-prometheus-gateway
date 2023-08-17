import { parse } from "yaml"
import { resolve } from "path"
import { readFile } from "fs/promises"
import { MetricsConfiguration } from "./types"

const configFile = resolve(__dirname, "..", "config.yaml")
export default async function readConfig() {
  return parse((await readFile(configFile)).toString()) as MetricsConfiguration
}
