var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
e.preventDefault();
if (input.value) {
    socket.emit('chat', input.value);
    input.value = '';
}
});

let timeout;

$('#input').on('input', (e) => {
    socket.emit('typing')
})

socket.on('roomname', (room) => {
    document.title = 'Room: ' + room + ' | Chat App'
    document.querySelector('.roomName').innerHTML = room
})

socket.on('userCount', (count) => {
    document.querySelector('.userCount').innerHTML = '<i class="uil uil-user"></i> ' + count 
})

socket.on('users', (users) => {
    userDiv = document.querySelector('.userInfo')
    userDiv.innerHTML = ''
    users.map(user => {
        var item = document.createElement('li');
        item.innerHTML = '<i class="uil uil-user"></i> ' + user.userName
        userDiv.appendChild(item);
    })
    
        
})

socket.on('typing', (msg) => {
    
    $('.typingInfo').html(`<i class="uil uil-comment-alt-dots"></i> ${msg}`)
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        $('.typingInfo').html('')
    }, 500)
})

socket.on('chat', function(msg) {

    item = document.createElement('li');
    messages = document.querySelector('#messages')
    itemClasses = []
    condition = messages.lastChild && messages.lastChild.classList[1] === msg.user.id

    document.querySelector('#messages').childNodes.forEach(e =>  itemClasses.push(e.classList[e.classList.length -1]))

    if (itemClasses.includes(msg.textId.toString())) {
        return 
    } else {
        if (socket.id === msg.user.id) {
            item.classList = `right ${msg.user.id} ${msg.textId}`
            if (condition) {
                item.innerHTML = '<div style="margin-top:-40px">' + msg.text + '</div>'  + `<strong id='author-right' style="display:none">${msg.user.userName}</strong>` 
            } else {
                item.innerHTML = '<div>' + msg.text + '</div>'  + `<strong id='author-right'>${msg.user.userName}</strong>` 
            }
        } else {
            item.classList = `left ${msg.user.id} ${msg.textId}` 
            if (condition) {
                item.innerHTML = `<strong id='author-left' style="display:none">${msg.user.userName}</strong>`  + '<div style="margin-top:-40px">' + msg.text + '</div>' 
            } else {
                item.innerHTML =`<strong id='author-left'>${msg.user.userName}</strong>`  + '<div>' + msg.text + '</div>' 
            }
        }
}
messages.appendChild(item);
window.scrollTo(0, document.body.scrollHeight);
});






document.querySelector('emoji-picker')
.addEventListener('emoji-click', event => {
    document.querySelector('#input').value += event.detail.unicode
});


$('.emojiButton').click(()=> {
    $('.emojiPicker').toggle()
})

$('.userCount').click(()=>{
    $('.userInfo').toggle()
})