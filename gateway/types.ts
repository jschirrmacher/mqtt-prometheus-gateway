import { LogLevel } from "useful-typescript-functions"

export type MetricType = "counter" | "gauge" | "histogram" | "summary"
export type Topic = string
export type Path = string
export type BaseType = string | number

export type LabelList = Record<string, BaseType>

export type SingleConfiguration = {
  name: string
  description: string
  type: MetricType
  topic: Topic
  path: Path
  labels: LabelList
}

export type MetricsConfiguration = {
  logLevel?: LogLevel
  metrics: SingleConfiguration[]
}
