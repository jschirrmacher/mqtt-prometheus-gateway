type MetricType = "counter" | "gauge" | "histogram" | "summary"
type LabelList = Record<string, string | number>

function object2label(obj: LabelList) {
  return Object.entries(obj)
    .map(([key, val]) => `${key}="${val}"`)
    .join(", ")
}

export function createMetric(
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
