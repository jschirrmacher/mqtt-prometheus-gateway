import mqtt from "mqtt"
import { metrics } from "./MetricsModel"
import { Config } from "./types"
import { flatten } from "useful-typescript-functions"

const user = process.env.MQTT_USER
const pwd = process.env.MQTT_PASSWORD
const brokerName = process.env.MQTT_BROKER || "localhost"
const port = process.env.MQTT_PORT || "1883"
const auth = user && pwd ? `${user}:${pwd}@` : ""

function unique<T>(list: T[]) {
  return [...new Set(list)]
}

const client = mqtt.connect(`mqtt://${auth}${brokerName}:${port}`)

export default function (config: Config) {
  const topics = unique(config.metrics.map(metric => metric.topic))

  client.on("connect", () => {
    console.info(`Connection to mqtt://${brokerName}:${port} established`)

    topics.forEach(topic => {
      client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Subscription of topic '${topic}' failed:`, err)
        } else {
          console.info(`Topic '${topic}' subscribed, waiting for data...`)
        }
      })
    })
  })
  
  client.on("message", (topic, message) => {
    const payload = JSON.parse(message.toString())
    const values = flatten(payload)
    console.log(topic, values)
    const { Meter_number, Total, voltage, current } = payload.STROM
    Object.assign(metrics, { Meter_number, Total, voltage, current })
  })
  
  client.on("error", (error) => console.error({ error }))
  client.on("disconnect", () =>
    console.info(`mqtt://${brokerName}:${port} disconnected`)
  )  
}
