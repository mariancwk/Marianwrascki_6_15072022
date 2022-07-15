const mongoose = require('mongoose')
// Plugin pour améliorer la résolution des erreurs d'email unique 
const uniqueValidator = require('mongoose-unique-validator')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

// User mongoose schema 
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

userSchema.plugin(mongodbErrorHandler)
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)