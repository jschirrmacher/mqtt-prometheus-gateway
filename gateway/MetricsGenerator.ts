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

function getLabels(config: SingleConfiguration) {
  return Object.fromEntries(
    Object.entries(config.labels || {}).map(([key, path]) => [
      key,
      metrics[config.topic][path as string],
    ])
  ) as LabelList
}

function getValue(config: SingleConfiguration) {
  return metrics[config.topic][config.path as string] as BaseType
}

export default function getMetrics(config: MetricsConfiguration) {
  config.metrics
    .map((config) => config.topic)
    .filter((topic) => !metrics[topic])
    .forEach((topic) => console.warn(`path '${topic}' not found in metrics`))

  return config.metrics
    .filter((config) => metrics[config.topic])
    .map((config) => createMetric(config, getValue(config), getLabels(config)))
    .join("")
}
