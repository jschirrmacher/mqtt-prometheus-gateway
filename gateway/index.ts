import { config } from "dotenv-flow"
config()
import readConfig from "./Config"
import getMetrics from "./MetricsGenerator"
import setupMQTTClient from "./MQTTClient"
import { routerBuilder, setupServer } from "useful-typescript-functions"

async function setup() {
  const config = await readConfig()
  setupMQTTClient(config)
  setupServer({
    middlewares: [
      routerBuilder("/metrics", "metrics")
        .get("/", (req) => getMetrics(config))
        .build(),
    ],
  })
}

setup()
