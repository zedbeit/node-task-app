const express = require('express')
const multer = require('multer')
const User = require('../db/models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

// multer config
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Upload an image with any of these extensions jpg, jpeg or png'))
        }
        return cb(undefined, true)
    }
})

// Sign up or create user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(500).send(error)        
    }
})
// Login User
router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})   
    } catch (e) {
        res.status(400).send('Unable to login')
    }
})
// Update user
router.patch('/users/me', auth ,async (req, res) => {

    const allowedUpdates = ['name', 'age', 'email', 'password']
    const updates = Object.keys(req.body)
    const isValidOp = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOp) {
        return res.status(400).send('Property does not exist!')
    }

    try {
        // const user = await User.findByIdAndUpdate( req.params.id, req.body, { new: true, runValidators: true })

        // const user = await User.findById(req.params.id)
        
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        
        await req.user.save()
        
        // if(!user) {
        //     return res.status(404).send('User does not exist')
        // }

        res.send(req.user)

    } catch (e) {
        res.status(500).send(e)
    }
})
// Logout 
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        res.send()
        await req.user.save()
    } catch (e) {
        res.status(500).send()
    }
})
// Logout All Users
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})
// Upload User avatar
router.post('/users/me/avatar', auth, upload.single('upload'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send("'error:' "+ error.message)
})
// Get my profile
router.get('/users/me', auth , async (req, res) => {
    try {
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})
// Delete User
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id)

        // if (!user) {
        //     return res.status(404).send('User does not exist')
        // }
        await req.user.remove()    
        res.send(req.user)

    } catch (e) {
        res.status(500).send()
    }
})
//  Deleting an Avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send(req.user)    
    } catch (e) {
           res.status(500).send()
    }         
})
//  Fetching an Avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        
        if (!user||!user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router