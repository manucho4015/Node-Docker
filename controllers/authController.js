const { response } = require('express')
const User = require('../models/userModel')

const bcrypt = require('bcryptjs')

exports.signUp = async (req, res) => {
    const {username, password} = req.body
    
    try {
        const hashpassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            username,
            password: hashpassword
        })
        req.session.user = newUser
        console.log(newUser)
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    } catch (e) {
        res.status(400).json({
            status: 'fail'
        })
        console.log(e)
    }
}

exports.login = async (req, res) => {
    const {username, password} = req.body

    try {
        const user = await User.findOne({username})

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password)

        if (isCorrect) {
            req.session.user = user;
            res.status(200).json({
                status: 'success'
            })
            console.log(user)
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'incorrect username or passoword'
            })
        }
    } catch (e) {
        response.status(400).json({
            status: 'fail'
        })
    }
}