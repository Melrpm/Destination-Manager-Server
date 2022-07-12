const express = require('express')
const { default: rateLimit } = require('express-rate-limit')
require('dotenv').config()
const port = 5000
const fs = require('fs')
const mongoose = require('mongoose')
const PlacesRoute = require('./routes/places')
const CitiesRoute = require('./routes/cities')

const app = express()
const limiter = rateLimit({
    max: 50,
    windowMs: 10000,
})

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, () =>{
    console.log("DB Connection Succesful")
})

app.use('/places', PlacesRoute)
app.use('/cities', CitiesRoute)

app.get('/', limiter, (req, res) =>{
    res.send('API LIVE')
})

app.listen(port, () => console.log(`Listening on port ${port}`))