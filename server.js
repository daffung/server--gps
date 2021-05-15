if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const express = require('express')
const app = express()
const cors = require('cors')
const server = require('http').createServer(app)
app.use(cors())

//object for 1 item (update with array when using many items)
let newGeoJson
//
//app.use(express.static(__dirname+'clients'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology:true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))
const lastLocation = require('./models/lastLocation')




app.get('/lastlocation',async (req,res)=>{
    const existData = await lastLocation.find({})
    res.status(200).send(existData)
})





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
        newGeoJson = data.data
        io.emit('renderData',{data:data.data,date:data.date})
    })
    socket.on('disconnect',async ()=>{
      
        const lastData = new lastLocation({name:JSON.parse(newGeoJson).properties.title,lastLocation:newGeoJson})
        const savedData = await lastLocation.findOneAndUpdate({name:lastData.name},{lastLocation:lastData.lastLocation})
        if(savedData === null){
            await lastData.save()
        }
        
        console.log('Disconnected')
    })
})
//console.log(Date.now())
server.listen(process.env.PORT || 4000, () => console.log(`Server has started.`));