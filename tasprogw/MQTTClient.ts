import mqtt from "mqtt"
import { metrics } from "./MetricsModel"

const user = process.env.MQTT_USER
const pwd = process.env.MQTT_PASSWORD
const brokerName = process.env.MQTT_BROKER || "localhost"
const port = process.env.MQTT_PORT || "1883"
const auth = user && pwd ? `${user}:${pwd}@` : ""
const topic = process.env.MQTT_TOPIC

if (!topic) {
  throw Error("Environment variable MQTT_TOPIC not set - aborting")
}

const client = mqtt.connect(`mqtt://${auth}${brokerName}:${port}`)
client.on("connect", () => {
  console.info(`Connection to mqtt://${brokerName}:${port} established`)
  client.subscribe(topic, (err) => {
    if (err) {
      console.error("Subscription failed:", err)
    } else {
      console.info("Topic subscribed, waiting for data...")
    }
  })
})

client.on("message", (_, message) => {
  const payload = JSON.parse(message.toString())
  const { Meter_number, Total, voltage, current } = payload.STROM
  Object.assign(metrics, { Meter_number, Total, voltage, current })
  console.debug(Object.values(metrics).join(" "))
})

client.on("error", (error) => console.error({ error }))
client.on("disconnect", () =>
  console.info(`mqtt://${brokerName}:${port} disconnected`)
)
