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

app.get('/ChatPage/chat.html', (req, res) => {
    app.use(express.static(__dirname + '/public/pages/'))
    if (req.query.username.length > 15 || req.query.roomname.length > 10) {
        return res.sendStatus(400)
    }
    user.userName = req.query.username
    room = req.query.roomname
    rooms.includes(room) ? null : rooms.push(room)
    res.sendFile(__dirname + '/public/pages/ChatPage/chat.html')
})

const formatMessage = (user, text) => {
    return {user, text}
} 

io.on('connection', (socket) => {
    
    if (user.userName) {
        user.id = socket.id
        user.room = room
        users.push(user)
        user = {}
        socket.join(room)
        io.to(room).emit('users', users)
        io.to(room).emit('roomname', room)
        roomUsers = users.filter(user => user.room === room)
        io.to(room).emit('userCount', roomUsers.length)
        room = ''
    }
    
    if (users.length > 0) {
        username = users.find(user => user.id === socket.id)
        socket.join(username.room)
        roomUsers = users.filter(user => user.room === username.room)
        socket.to(username.room).emit('userCount', roomUsers.length)
        socket.broadcast.to(username.room).emit('chat', formatMessage(username, "<span class='connect'> has joined the room</span>"))
    }

    socket.on('chat', (msg) => {
        username = users.find(user => user.id === socket.id)
        socket.join(username.room)
        io.to(username.room).emit('chat', formatMessage(username, msg))
    })

    socket.on('disconnect', () => {
        username = users.find(user => user.id === socket.id)
        users = users.filter((user) => user !== username)
        socket.join(username.room)
        roomUsers = users.filter(user => user.room === username.room)
        io.to(username.room).emit('users', roomUsers)
        socket.to(username.room).emit('userCount', roomUsers.length)
        socket.broadcast.to(username.room).emit('chat', formatMessage(username, "<span class='dc'>has been disconnected</span>"))
    })

    socket.on('typing', () => {
        username = users.find(user => user.id === socket.id)
        socket.join(username.room)
        socket.broadcast.to(username.room).emit('typing', `${username.userName} is typing...`)
    })

});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});