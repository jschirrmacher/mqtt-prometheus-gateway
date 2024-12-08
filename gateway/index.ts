import { config } from "dotenv-flow"
config()
import * as actualMqtt from "mqtt"
import readConfig from "./Config"
import getMetrics from "./MetricsGenerator"
import setupMQTTClient from "./MQTTClient"
import { setupServer, defineRouter, Logger } from "useful-typescript-functions"

async function setup() {
  const config = await readConfig()
  const logger = Logger()
  logger.setLogLevel(config.logLevel || "info")
  setupMQTTClient(config, actualMqtt, logger)
  setupServer({
    port: config.HTTP_PORT,
    routers: [
      defineRouter("/metrics", "metrics").get("/", () => getMetrics(config.metrics)),
    ],
  })
}

setup()
