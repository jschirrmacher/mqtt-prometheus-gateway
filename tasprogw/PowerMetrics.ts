import { metrics } from "./MetricsModel"
import { createMetric } from "./MetricsGenerator"

export default function () {
  const labels = { meter: metrics.Meter_number }
  return (
    createMetric(
      "electric_meter_total",
      "The total kWh measured by an electric meter",
      "counter",
      metrics.Total,
      labels
    ) +
    createMetric(
      "electric_meter_voltage",
      "The voltage measured",
      "gauge",
      metrics.voltage,
      labels
    ) +
    createMetric(
      "electric_meter_current",
      "The electric current measured",
      "gauge",
      metrics.current,
      labels
    )
  )
}
