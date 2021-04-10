
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
const io = require('socket.io')(3000, {
    cors: {
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
    }
});

io.on('connection', (socket) => {
    //socket.emit('hi', 'Hello World')
    socket.on('sendData',(data)=>{
        console.log(data)
       socket.broadcast.emit('renderData',{data:data})
    })
    socket.on('disconnect',()=>{
        console.log('Disconnected')
    })
})
