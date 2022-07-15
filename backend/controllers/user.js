const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// Singup a user in database
exports.signup = async(req, res, next) => {
    let hash
    
    // encryption the user's password with bcrypt
    try {
        hash = await bcrypt.hash(req.body.password, 10)
    } catch (error) {
        return res.status(500).json({ error })
    }

    const user = new User({
        email: req.body.email,
        password: hash
    })

    //Check if the email is already used 
    if (await User.findOne({ email: user.email })) {
        return res.status(400).json({ message: 'Email already used' })
    }
    
    try {
        await user.save()
        res.status(201).json({ message: 'User created' })
    } catch (error) {
        res.status(400).json({ error })
    }
}

    // give acces to the user account
exports.login = async(req, res, next) => {
    let user
    
    try {
        user = await User.findOne({ email: req.body.email })
        
        if (!user) return res.status(401).json({ error: 'User missing' })

        // Compare the crypted password send from the client and the database one 
        if (!await bcrypt.compare(req.body.password, user.password))
            return res.status(401).json({ error: 'Wrong password' })

    } catch (error) {
        return res.status(500).json({ error })
    }

    // Give a json web token (id + password) for authorization
    res.status(200).json({
        userId: user._id,
        token: jwt.sign(
            { userId: user._id },
            process.env.TOKEN_KEY, 
            { expiresIn: '24h' }
        )
    })
}