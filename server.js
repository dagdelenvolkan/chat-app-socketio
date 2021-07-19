const express    = require('express')
const http       = require('http')
const { Server } = require('socket.io')

const app    = express()
const server = http.createServer(app)
const io     = new Server(server)
const PORT   = process.env.PORT || 3000

const {addRooms, getRoom, updateRooms} = require('./db/Controllers/roomController')
const User = require('./db/models/user')


let users = []
let user  = {}
let rooms = []
let room = {};

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
    room.name = req.query.roomname
    room.messages = []
    rooms.includes(room) ? null : rooms.push(room)
    addRooms(rooms, room.name)
    res.sendFile(__dirname + '/public/pages/ChatPage/chat.html')
})

const formatMessage = (user, text) => {
    return {user, text}
} 

io.on('connection', (socket) => {
    
    if (user.userName) {
        let userModel = new User(socket.id, user.userName, room.name)
        // user.id = socket.id
        // user.room = room.name
        users.push(userModel)
        user = {}
        socket.join(room.name)
        io.to(room.name).emit('users', users)
        io.to(room.name).emit('roomname', room.name)
        roomUsers = users.filter(user => user.room === room.name)
        io.to(room.name).emit('userCount', roomUsers.length)
        room = {}
    }
    
    if (users.length > 0) {
        let username = users.find(user => user.id === socket.id)
        let roomData = getRoom(username.room)
        if (username.room) {
            socket.join(username.room)
            if (roomData) {
                roomData
                .then(data => data.messages ? data.messages.map(message => {
                    console.log(message.user);
                    io.to(data.name).emit('chat', formatMessage(message.user, message.message))
                }): null)
                .then(console.log('Succesfull'))
            }
            roomUsers = users.filter(user => user.room === username.room)
            socket.to(username.room).emit('userCount', roomUsers.length)
            socket.broadcast.to(username.room).emit('chat', formatMessage(username, "<span class='connect'> has joined the room</span>"))
        }
    }

    socket.on('chat', (msg) => {
        username = users.find(user => user.id === socket.id)
        socket.join(username.room)
        io.to(username.room).emit('chat', formatMessage(username, msg))
        updateRooms(username.room, username, msg)
    })

    socket.on('disconnect', () => {
        username = users.find(user => user.id === socket.id)
        users = users.filter((user) => user !== username)
        if (username) {
            socket.join(username.room)
            roomUsers = users.filter(user => user.room === username.room)
            io.to(username.room).emit('users', roomUsers)
            socket.to(username.room).emit('userCount', roomUsers.length)
            socket.broadcast.to(username.room).emit('chat', formatMessage(username, "<span class='dc'>has been disconnected</span>"))
        }
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