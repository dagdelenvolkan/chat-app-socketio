const express    = require('express')
const http       = require('http')
const { Server } = require('socket.io')

const app    = express()
const server = http.createServer(app)
const io     = new Server(server)
const PORT   = process.env.PORT || 3000

let users = []
let user  = {}
let rooms = []
let room;

app.get('/', (req, res) => {    
    app.use(express.static(__dirname + '/public/pages/LoginPage'))
    res.sendFile(__dirname + '/public/pages/LoginPage/chatLogin.html');
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});