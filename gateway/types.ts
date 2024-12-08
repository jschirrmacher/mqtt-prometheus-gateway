import { LogLevel } from "useful-typescript-functions"

export type MetricType = "counter" | "gauge" | "histogram" | "summary"
export type Topic = string
export type Path = string
export type BaseType = string | number

export type LabelList = Record<string, BaseType>

export type MetricsConfiguration = {
  name: string
  description: string
  type: MetricType
  topic: Topic
  path: Path
  labels: LabelList
}

export type Configuration = {
  logLevel?: LogLevel
  metrics: MetricsConfiguration[]
  MQTT_BROKER: string
  MQTT_PORT: number
  MQTT_USER: string
  MQTT_PASSWORD: string
  HTTP_PORT: number
}
