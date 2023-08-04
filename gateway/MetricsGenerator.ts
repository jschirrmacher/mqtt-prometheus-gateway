import type { BaseType, LabelList, SingleConfiguration } from "./types"
import { metrics } from "./MetricsModel"
import { MetricsConfiguration } from "./types"

function object2label(obj: LabelList) {
  return Object.entries(obj)
    .map(([key, val]) => `${key}="${val}"`)
    .join(", ")
}

function createMetric(
  config: SingleConfiguration,
  value: string | number,
  labels: Record<string, string | number> = {}
) {
  const labelInfo = object2label(labels)
  const entry = labelInfo ? config.name + "{" + labelInfo + "}" : config.name
  return (
    `# HELP ${config.name} ${config.description}\n` +
    `# TYPE ${config.name} ${config.type}\n` +
    `${entry} ${value}\n\n`
  )
}

export default function getMetrics(config: MetricsConfiguration) {
  return config.metrics
    .map((config) => {
      const labels = Object.fromEntries(
        Object.entries(config.labels).map(([key, path]) => [
          key,
          metrics[config.topic][path],
        ])
      ) as LabelList
      const value = metrics[config.topic][config.path] as BaseType

      return createMetric(config, value, labels)
    })
    .join("")
}
