import { config } from "dotenv-flow"
config()
import * as actualMqtt from "mqtt"
import readConfig from "./Config"
import getMetrics from "./MetricsGenerator"
import setupMQTTClient from "./MQTTClient"
import {
  setupServer,
  defineRouter,
  LogLevel,
} from "useful-typescript-functions"

const logPrintLevel = {
  error: ["error"],
  warn: ["error", "warn"],
  info: ["error", "warn", "info"],
  debug: ["error", "warn", "info", "debug"],
}

const printLog = (level: LogLevel) => (msg: string | object) =>
  logPrintLevel[logger.logLevel].includes(level) && console.log(msg)

const logger = {
  logLevel: "info" as LogLevel,
  debug: printLog("debug"),
  info: printLog("info"),
  warn: printLog("warn"),
  error: printLog("error"),
}

async function setup() {
  const config = await readConfig()
  logger.logLevel = config.logLevel || "info"
  setupMQTTClient(config, actualMqtt, logger)
  setupServer({
    routers: [
      defineRouter("/metrics", "metrics").get("/", () => getMetrics(config)),
    ],
  })
}

setup()
