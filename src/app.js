const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')

const port = process.env.PORT
const app = express()


app.use(express.json())
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up at port ' + port)
})





