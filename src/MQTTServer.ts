import Aedes from "aedes"
import { createServer } from "net"

const MQTT_PORT = process.env.MQTT_PORT || 1883

export const aedes = Aedes()
const mqttServer = createServer(aedes.handle)
mqttServer.listen(MQTT_PORT, () =>
  console.log("MQTT broker running on mqtt:" + MQTT_PORT)
)

aedes.on("client", (client) => console.log("new client", client.id))
aedes.on("connackSent", (packet) => console.log("sent connack", packet))
aedes.on("clientError", (client, err) =>
  console.log("client error", client.id, err.message, err.stack)
)
aedes.on("connectionError", (client, err) =>
  console.log("client error: client: %s, error: %s", client.id, err.message)
)
aedes.on("ack", (message, client) =>
  console.log('%s ack\'d message "%s"', client.id, message)
)
aedes.on("clientDisconnect", (client) =>
  console.log("%s disconnected", client.id)
)

aedes.on("subscribe", (subscriptions, client) => {
  if (client) {
    console.log("%s subscribe %s", subscriptions, client.id)
  }
})

aedes.on("publish", function (packet, client) {
  if (client) {
    console.log("%s : topic %s : %s", client.id, packet.topic, packet.payload)
  }
})

aedes.authenticate = function (client, username, password, callback) {
  if (username === "DVES_USER" && password?.toString() === "test123") {
    callback(null, true)
  } else {
    callback({ ...new Error("Auth error"), returnCode: 4 }, null)
  }
}
