import express from "express"

const HTTP_PORT = process.env.HTTP_PORT || 3000

export const httpServer = express()

httpServer.listen(HTTP_PORT, () => {
  console.info("HTTP server tunning on http://localhost:" + HTTP_PORT)
})
