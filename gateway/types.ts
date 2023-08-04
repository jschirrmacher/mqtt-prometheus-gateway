export type MetricType = "counter" | "gauge" | "histogram" | "summary"
export type LabelList = Record<string, string | number>

export type Config = {
  metrics: {
    name: string
    description: string
    type: MetricType
    topic: string
    path: string
    labels: LabelList
  }[]
}
