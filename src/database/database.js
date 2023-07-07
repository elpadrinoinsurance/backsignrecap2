require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')
const MONGODB_URI=process.env.MONGODB_URL
const { roles } = require('./constants')

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(async db => {
    console.log('Database is connected')
})
.catch(err => console.log(err))
