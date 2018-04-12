const express = require('express')
const Sequelize = require('sequelize')

// Setup Sequelize to use SQLite database
// Note: Requires the sqlite3 module - do not need to be required, just installed
const sequelize = new Sequelize('sqlite:./data/database.sqlite', {
    loggin: console.log
})

// Define Message model
const Message = sequelize.define('message', {
    text: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Define user model
const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Define associations
User.hasMany(Message)
Message.belongsTo(User)

const app = express()

app.get('/generate/henning', (req, res) => {
    User.create({
        username: 'hh',
        password: 'secret'
    })
    .then(user => {
        res.json(user)
    })
    .catch(error => {
        res.json({
            message: 'Error creating user..'
        })
    })
})

app.get('/generate/message', (req, res) => {
    // Random message
    let text = 'Hello ' + Math.floor(Math.random() * 999999)

    Message.create({
        text: text
    })
    .then(() => {
        return res.send('Message created!')
    })
    .catch(error => {
        return res.send('Error creating message!')
    })
})

app.get('/users', (req, res) => {
    User.findAll()
    .then(users => {
        res.json(users)
    })
    .catch(error => {
        res.json({
            message: 'Error getting users..'
        })
    })
})

app.get('/messages', (req, res) => {
    Message.findAll()
    .then(messages => {
        res.json(messages)
    })
    .catch(error => {
        res.json({
            message: 'Error getting messages..'
        })
    })
})

app.get('/messages/:id', (req, res) => {
    let query = {
        where: {
            id: req.params.id
        }
    }

    Message.findOne(query)
    .then(message => {
        if (message) {
            return res.json(message)
        }

        res.status(404).json({
            message: 'Not found'
        })
    })
    .catch(error => {
        res.json({
            message: 'Error getting message'
        })
    })
})

sequelize.sync({ force: true }).then(() => {
    app.listen(3000, () => {
        console.log('Database is ready and server is running..')
    })
})