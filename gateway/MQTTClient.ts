import * as actualMqtt from "mqtt"
import { type MqttClient } from "mqtt"
import { flatten } from "useful-typescript-functions"
import { metrics } from "./MetricsModel"
import { type BaseType, MetricsConfiguration } from "./types"

function unique<T>(list: T[]) {
  return [...new Set(list)]
}

export interface MQTT {
  connect(url: string): MqttClient
}

interface Logger {
  info: (msg: string | object) => void
  error: (msg: string | object) => void
  debug: (msg: string | object) => void
}

export default function (
  config: MetricsConfiguration,
  mqtt: MQTT = actualMqtt,
  logger: Logger = console
) {
  const user = process.env.MQTT_USER
  const pwd = process.env.MQTT_PASSWORD
  const brokerName = process.env.MQTT_BROKER || "localhost"
  const port = process.env.MQTT_PORT || "1883"
  const auth = user && pwd ? `${user}:${pwd}@` : ""

  const client = mqtt.connect(`mqtt://${auth}${brokerName}:${port}`)
  const topics = unique(config.metrics.map((metric) => metric.topic))

  client.on("connect", () => {
    logger.info(`Connection to mqtt://${brokerName}:${port} established`)

    topics.forEach((topic) => {
      client.subscribe(topic, (err) => {
        if (err) {
          logger.error(
            `Subscription of topic '${topic}' failed: ${JSON.stringify(err)}`
          )
        } else {
          logger.info(`Topic '${topic}' subscribed, waiting for data...`)
        }
      })
    })
  })

  client.on("message", (topic, message) => {
    const values = flatten(JSON.parse(message.toString()))
    logger.debug({ topic, values })
    metrics[topic] = values as Record<string, BaseType>
  })

  client.on("error", (error) => logger.error({ error }))

  client.on("disconnect", () =>
    logger.info(`mqtt://${brokerName}:${port} disconnected`)
  )
}
