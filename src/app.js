const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')

const app = express()

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

module.exports = app





