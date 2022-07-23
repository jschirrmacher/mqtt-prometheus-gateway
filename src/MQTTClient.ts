import mqtt from "mqtt"
import { metrics } from "./MetricsModel"

const user = process.env.MQTT_USER
const pwd = process.env.MQTT_PASSWORD
const server = process.env.MQTT_SERVER
const port = process.env.MQTT_PORT

console.log(`mqtt://${user}:${pwd}@${server}:${port}`)
const client = mqtt.connect(`mqtt://${user}:${pwd}@${server}:${port}`)
client.on("connect", () => {
  console.log("Connection established")
  client.subscribe("tele/tasmota_D9740F/SENSOR", (err) => {
    console.log("subscribed", err)
  })
})

client.on("message", (topic, message) => {
  const payload = JSON.parse(message.toString())
  const { Meter_number, Total, voltage, current } = payload.STROM
  Object.assign(metrics, { Meter_number, Total, voltage, current })
  console.log(Object.values(metrics).join(" "))
})

client.on("error", (error) => console.error({ error }))
