import { metrics } from "./MetricsModel"
import { createMetric } from "./MetricsGenerator"
import { Config } from "./types"
import { flatten } from "useful-typescript-functions"

export default function (config: Config) {
  return {
    getMetrics() {
      const values = flatten(metrics) as { [k: string]: string | number }

      return config.metrics
        .map((config) => {
          const labels = Object.fromEntries(
            Object.entries(config.labels).map(([key, path]) => [
              key,
              values[path],
            ])
          )

          return createMetric(
            config.name,
            config.description,
            config.type,
            values[config.path],
            labels
          )
        })
        .join("")
    },
  }
}
