import { config } from "dotenv-flow"
config()
import readConfig from "./Config"

import { httpServer } from "./HTTPServer"
import PowerMetrics from "./Metrics"
import setupMQTTClient from "./MQTTClient"

async function setup() {
  const config = await readConfig()
  setupMQTTClient(config)
  const metrics = PowerMetrics(config)
  
  httpServer.get("/metrics", async (req, res) => {
    res.header("Content-Type", "text/plain").send(metrics.getMetrics())
  })
}

setup()
