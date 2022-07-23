import { config } from "dotenv-flow"
config()

import { httpServer } from "./HTTPServer"
import PowerMetrics from "./PowerMetrics"
import "./MQTTClient"

httpServer.get("/metrics", (req, res) => {
  res.header("Content-Type", "text/plain").send(PowerMetrics())
})
