
const express = require('express')
const app = express()
const cors = require('cors')
const server = require('http').createServer(app)
app.use(cors())

//app.use(express.static(__dirname+'clients'))

const io = require('socket.io')(server, {
    cors: {
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
    }
});

io.on('connection', (socket) => {
    socket.emit('hi', {date:Date.now()})
    socket.on('sendData',(data)=>{
        console.log(data)
       socket.broadcast.emit('renderData',{data:data,date:Date.now()})
    })
    socket.on('disconnect',()=>{
        console.log('Disconnected')
    })
})
server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));
