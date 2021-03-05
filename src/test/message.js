require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

describe('Message API endpoints', () => {
    beforeEach((done) => {
        // TODO: add any beforeEach code here
        user_one = new User({username: "M1", password: "mmone"})
        user_two = new User({username: "M2", password: "mmtwo"})
        message_one = new Message({
            title: "Important Message",
            body: "Hello there",
            author: user_one
        })
        message_two = new Message({
            title = "Another Important Message",
            body: "Hi there",
            author: user_two
        })
        users.push(user_one)
        users.push(user_two)
        messages.push(message_one)
        messages.push(message_two)
        
        users.forEach(user => {
            user.save()
        })
        messages.forEach(message => {
            message.save()
        })
        done()
    })

    afterEach((done) => {
        // TODO: add any afterEach code here
        users.forEach(user => {
            User.findByIdAndDelete(user.id)
        })
        messages.forEach(message => {
            Message.findByIdAndDelete(message.id)
        })
        done()
    })

    it('should load all messages', (done) => {
        // TODO: Complete this
        chai
        .request(app)
        .get("/messages")
        .end(function(err, res) {
            if (err) {
                return done(err)
            }
            res.status.should.equal(200)
            res.body.should.be.a("array")
            res.body.should.have.lengthOf.above(3)
        })
        done()
    })

    it('should get one specific message', (done) => {
        // TODO: Complete this
        chai
        .request(app)
        .get("/messages/" + message_one.id)
        .end(function(err, res) {
            if (err) {
                return done(err)
            }
            res.status.should.equal(200)
            res.body.should.be.a("Object")
            res.body.shoud.have.a.property("title").and.to.equal(message_one.title)
            res.body.shoud.have.a.property("body").and.to.equal(message_one.body)
            res.body.shoud.have.a.property("author").and.to.equal(message_one.author)
        })
        done()
    })

    it('should post a new message', (done) => {
        // TODO: Complete this
        let newPost = {
            title: "Important Message3",
            body: "How are you?!",
            author: "user_one.id"
        }
        chai
        .request(app)
        .post("/messages")
        .type("form")
        .send(newPost)
        .end(function(err, res) {
            if (err) {
                return done(err)
            }
            Message.findById(res.body.id)
                .catch(err => {
                    return done(err)
                })
            res.status.shoud.equal(200)
            res.body.should.be.a("Object")
            res.body.should.have.property("title").and.to.equal(newPost.title)
            res.body.should.have.property("body").and.to.equal(newPost.body)
            res.body.should.have.property("author").and.be.equal(newPost.author)
        })
        done()
    })

    it('should update a message', (done) => {
        // TODO: Complete this
        chai
        .request(app)
        .put("/messages/" + messages[0].id)
        .type("form")
        .send({
            title: "Update Message",
            body: messages[0].body,
            author: messages[0].author.id
        })
        .end(function(err, res) {
            if (err) {
                return done(err)
            }
            Message.findById(res.body.id)
                .catch(err => {
                    return done(err)
                })
            res.status.should.equal(200)
            res.body.should.have.property("title").and.to.equal("Update Message")
            res.body.should.have.property("body").and.to.equal(messages[0].body)
            res.body.should.have.property("author").and.be.equal(messages[0].author)
        })
        done()
    })

    it('should delete a message', (done) => {
        // TODO: Complete this
        let id = messages[1].id
        chai
        .request(app)
        .delete("/messages/" + id)
        done()
    })
})
