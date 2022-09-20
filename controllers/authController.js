const User = require('../models/User')
const Posts = require('../models/Posts')
const Token = require('../models/tokenModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {secret} = require('../config')
const {validationResult} = require('express-validator')

const forbiddenSymbols = ['@', '#', '$', '%', '^']

const generateAccessToken = (id, username, age, posts) => {
    const payload = {
        id,
        username,
        age,
        posts
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class authController {
    async registration (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({message: "Registration error"})
            }
            const {username, password, age} = req.body
            const candidate = await User.findOne({username})
            if (candidate){
                return res.status(400).json({message: "This Username is taken"})
            }
            if (username[0] === ' ' || username[username.length - 1] === ' ') {
                return res.status(400).json({message: "The Space symbol can't stand at the beginning or at the ending of a Username"})
            }
            for (let symbol of password){
                if (forbiddenSymbols.includes(symbol)){
                    return res.status(400).json({message: `Username has forbidden symbol - '${symbol}'`})
                }
            }
            const integerAge = Number(age)
            if (3 >= integerAge || 120 < integerAge) {
                return res.status(400).json({message: 'Dude, are you SERIOUS?'})
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const user = new User({username, password: hashPassword, age})
            await user.save()
            return res.json({message: "User created successfully"})
        }catch (e) {
            console.log(e)
            return res.status(400).json({message: "Registration error"})
        }
    }
    async login (req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: "Wrong Username or Password"})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: "Wrong Username or Password"})
            }
            const newToken = generateAccessToken(user._id, user.username, user.age, user.posts)
            const token = new Token({userId: user._id, token: newToken})
            await token.save()
            res.json({token})
        }catch (e) {
            console.log(e)
            return res.status(400).json({message: "Login error"})
        }
    }
    async getUsers (req, res) {
        try {
            const users = await User.find()
            res.json(users)
        }catch (e) {
            console.log(e)
        }
    }
    async createPost (req, res) {
        try {
            const {title, description} = req.body
            const user = req.user
            const post = new Posts({userId: user.id, title, description, author: user.username})
            await post.save()
            return res.status(200).json({message: "Post created successfully"})
        }catch (e) {
            console.log(e)
            return res.status(200).json({message: 'Post creation error'})
        }
    }
}

module.exports = new authController()