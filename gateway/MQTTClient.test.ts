import { beforeEach, describe, expect, it, vi } from "vitest"
import MQTTClient, { MQTT } from "./MQTTClient"
import { MetricsConfiguration } from "./types"
import { metrics } from "./MetricsModel"

const subscribe = vi.fn()
const on = vi.fn()
const mqtt: MQTT = {
  connect: vi.fn().mockReturnValue({ subscribe, on }),
}

const config: MetricsConfiguration = {
  metrics: [
    {
      name: "test1",
      description: "A first test metric",
      type: "gauge",
      topic: "/topic1",
      path: "key1",
      labels: {},
    },
    {
      name: "test2",
      description: "A second test metric",
      type: "gauge",
      topic: "/topic2",
      path: "key2",
      labels: {},
    },
  ],
}

process.env.MQTT_BROKER = "my-broker.localhost"
process.env.MQTT_PORT = "1234"
process.env.MQTT_USER = "my-user"
process.env.MQTT_PASSWORD = "my-pwd"

function getHandler<T>(which: string) {
  return on.mock.calls.find((c) => c[0] === which)[1] as T
}

const logger = {
  info: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
}

describe("MQTTClient", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should connect to the configured MQTT Server", () => {
    MQTTClient(config, mqtt, logger)
    expect(mqtt.connect).toBeCalledWith(
      `mqtt://my-user:my-pwd@my-broker.localhost:1234`
    )
  })

  it("should subscribe to all configured MQTT topics", () => {
    MQTTClient(config, mqtt, logger)
    getHandler<() => void>("connect")()
    expect(subscribe).toBeCalledWith("/topic1", expect.any(Function))
    expect(subscribe).toBeCalledWith("/topic2", expect.any(Function))
  })

  it("should set the metrics model with incoming messages", () => {
    MQTTClient(config, mqtt, logger)
    getHandler<() => void>("connect")()
    const messageHandler =
      getHandler<(topic: string, message: string) => void>("message")
    messageHandler("/topic1", `{"test": 42}`)
    expect(metrics).toEqual({ "/topic1": { test: 42 } })
  })

  describe("should log", () => { 
    it("successful subscriptions", () => {
      MQTTClient(config, mqtt, logger)
      getHandler<() => void>("connect")()
      subscribe.mock.calls.at(0)[1]()
      expect(logger.info).toBeCalledWith(`Topic '/topic1' subscribed, waiting for data...`)
    })

    it("subscription errors", () => {
      MQTTClient(config, mqtt, logger)
      getHandler<() => void>("connect")()
      subscribe.mock.calls.at(0)[1]("test error")
      expect(logger.error).toBeCalledWith(
        "Subscription of topic '/topic1' failed: \"test error\""
      )
    })

    it("other errors", () => {
      MQTTClient(config, mqtt, logger)
      getHandler<() => void>("connect")()
      const errorHandler = getHandler<(err: string) => void>("error")
      errorHandler("test error")
      expect(logger.error).toBeCalledWith({ error: "test error" })
    })

    it("connections", () => {
      MQTTClient(config, mqtt, logger)
      getHandler<() => void>("connect")()
      expect(logger.info).toBeCalledWith(
        `Connection to mqtt://my-broker.localhost:1234 established`
      )
    })

    it("disconnects", () => {
      MQTTClient(config, mqtt, logger)
      getHandler<() => void>("disconnect")()
      expect(logger.info).toBeCalledWith(
        `mqtt://my-broker.localhost:1234 disconnected`
      )
    })

    it("messages in debug mode", () => {
      MQTTClient(config, mqtt, logger)
      getHandler<(topic: string, message: string) => void>("message")(
        "/topic1",
        `{"test": 42}`
      )
      expect(logger.debug).toBeCalledWith({
        topic: "/topic1",
        values: { test: 42 },
      })
    })
  })
})
