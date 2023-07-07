const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http').Server(app)
require('dotenv').config();
require('./database/database')
require('./socket')(http)
const { router } = require('./routes')
const {errorHandler} = require('./routes/middleware/errorHandler')

app.use(cors())
app.use(express.json({limit: '20mb', extended: true}))
app.use('/', router)
app.use(errorHandler)

http.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}`)
})