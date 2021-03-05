const express = require('express')
const router = express.Router();

const User = require('../models/user')
const Message = require('../models/message')

/** Route to get all messages. */
router.get('/', (req, res) => {
    // TODO: Get all Message objects using `.find()`
    let message = Message(req.body)
    message.find()
    .then(message => {
        return res.find(message)
    })
    // TODO: Return the Message objects as a JSON list
    .then(message => {
        return req.json(message)
    })
})

/** Route to get one message by id. */
router.get('/:messageId', (req, res) => {
    let message = Message(req.body)
    message.findOne(req.params.messageId)
    // TODO: Get the Message object with id matching `req.params.id`
     // using `findOne`
    // TODO: Return the matching Message object as JSON
    .then(message => {
        return res.json(message)
    })
})

/** Route to add a new message. */
router.post('/', (req, res) => {
    let message = new Message(req.body)
    message.save()
    .then(message => {
        return User.findById(message.author)
    })
    .then(user => {
        // console.log(user)
        user.messages.unshift(message)
        return user.save()
    })
    .then(() => {
        return res.send(message)
    }).catch(err => {
        throw err.message
    })
})

/** Route to update an existing message. */
router.put('/:messageId', (req, res) => {
    // TODO: Update the matching message using `findByIdAndUpdate`
    let message = Message(req.body) 
    message.findByIdAndUpdate(req.params.messageId)
    .then(message => {
        return res.json(message)
    })
})

/** Route to delete a message. */
router.delete('/:messageId', (req, res) => {
    // TODO: Delete the specified Message using `findByIdAndDelete`. Make sure
    // to also delete the message from the User object's `messages` array
    let message = Message(req.body)
    message.findByIdAndDelete(req.parads.messageId)
    // TODO: Return a JSON object indicating that the Message has been deleted
    .then(message => {
        return res.json('message has been deleted')
    })
})

module.exports = router