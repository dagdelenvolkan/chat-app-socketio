const express = require('express')
const http    = require('http')
const { Server }      = require('socket.io')

const app    = express()
const server = http.createServer(app)
const io     = new Server(server)
const PORT   = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})