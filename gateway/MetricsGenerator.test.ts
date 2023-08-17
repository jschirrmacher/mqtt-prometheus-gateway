import { describe, expect, it } from "vitest"
import getMetrics from "./MetricsGenerator"
import { MetricsConfiguration } from "./types"
import { metrics } from "./MetricsModel"

const config: MetricsConfiguration = {
  metrics: [
    {
      name: "test",
      description: "A test metric",
      type: "gauge",
      topic: "/my-topic",
      path: "folder.key",
      labels: {
        label1: "label-1",
        label2: "folder.label-2",
      },
    },
  ],
}

const config2: MetricsConfiguration = {
  metrics: [
    config.metrics[0],
    {
      name: "test-2",
      description: "Another metric",
      type: "counter",
      topic: "/my-topic",
      path: "other",
      labels: {},
    },
  ],
}

metrics["/my-topic"] = {
  "label-1": "first label",
  "folder.key": "test-value",
  "folder.label-2": "second label",
  other: "another-value",
}

describe("MetricsGenerator", () => {
  const result = getMetrics(config).split("\n")

  it("should contain the description", () => {
    expect(getMetrics(config).split("\n")).toContain(
      `# HELP test A test metric`
    )
  })

  it("should contain the metric type", () => {
    expect(result).toContain(`# TYPE test gauge`)
  })

  it("should contain the metric value", () => {
    expect(result).toContain(
      `test{label1="first label", label2="second label"} test-value`
    )
  })

  it("should contain all configured metrics", () => {
    const result = getMetrics(config2).split("\n")
    expect(result).toContain(
      `test{label1="first label", label2="second label"} test-value`
    )
    expect(result).toContain(`test-2 another-value`)
  })
})
