import { config } from "dotenv-flow"
config()
import readConfig from "./Config"

import { httpServer } from "./HTTPServer"
import getMetrics from "./MetricsGenerator"
import setupMQTTClient from "./MQTTClient"

async function setup() {
  const config = await readConfig()
  setupMQTTClient(config)
  httpServer.get("/metrics", async (req, res) => {
    res.header("Content-Type", "text/plain").send(getMetrics(config))
  })
}

setup()
