export type MetricType = "counter" | "gauge" | "histogram" | "summary"
export type LabelList = Record<string, string | number>
export type Topic = string
export type Path = string
export type BaseType = string | number

export type Config = {
  metrics: {
    name: string
    description: string
    type: MetricType
    topic: Topic
    path: Path
    labels: LabelList
  }[]
}
