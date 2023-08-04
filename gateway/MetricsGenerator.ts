import type { LabelList, MetricType } from "./types"
import { metrics } from "./MetricsModel"
import { Config } from "./types"

function object2label(obj: LabelList) {
  return Object.entries(obj)
    .map(([key, val]) => `${key}="${val}"`)
    .join(", ")
}

function createMetric(
  name: string,
  description: string,
  type: MetricType,
  value: string | number,
  labels: Record<string, string | number> = {}
) {
  const labelInfo = object2label(labels)
  const entry = labelInfo ? name + "{" + labelInfo + "}" : name
  return (
    `# HELP ${name} ${description}\n` +
    `# TYPE ${name} ${type}\n` +
    `${entry} ${value}\n\n`
  )
}

export default function getMetrics(config: Config) {
  return config.metrics
    .map((config) => {
      const labels = Object.fromEntries(
        Object.entries(config.labels).map(([key, path]) => [key, metrics[config.topic][path]])
      )

      return createMetric(
        config.name,
        config.description,
        config.type,
        metrics[config.topic][config.path],
        labels
      )
    })
    .join("")
}
