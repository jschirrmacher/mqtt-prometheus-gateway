import { config } from "dotenv-flow"
config()
import readConfig from "./Config"
import getMetrics from "./MetricsGenerator"
import setupMQTTClient from "./MQTTClient"
import { setupServer, defineRouter } from "useful-typescript-functions"

async function setup() {
  const config = await readConfig()
  setupMQTTClient(config)
  setupServer({
    routers: [
      defineRouter("/metrics", "metrics").get("/", () => getMetrics(config)),
    ],
  })
}

setup()
