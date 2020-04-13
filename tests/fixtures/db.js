const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/db/models/user')
const Task = require('../../src/db/models/task')

const setUpDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany({})
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
}

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: "Sayyed Beita",
    username: "zeddy",
    password: "MyParsse??",
    email: "dy31@gmail.com",
    tokens: [{
        token: jwt.sign({ _id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwo = {
    _id: userTwoId,
    name: "Usmaniyya",
    username: "kallamu",
    password: "MyParsse??",
    email: "devbeita1@gmail.com",
    tokens: [{
        token: jwt.sign({ _id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Finish Task App',
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Finish Chat App',
    owner: userTwo._id
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    setUpDatabase
}