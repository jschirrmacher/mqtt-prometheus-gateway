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

export const configKeys = [
  "MQTT_BROKER",
  "MQTT_PORT",
  "MQTT_USER",
  "MQTT_PASSWORD",
  "HTTP_PORT",
] as const

export type Configuration = {
  logLevel?: LogLevel
  metrics: MetricsConfiguration[]
} & {
  [key in (typeof configKeys)[number]]: string
}
