const { body, validationResult } = require('express-validator')
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const passwordValidator = require('password-validator')
const passwordSchema = new passwordValidator()

// Rules to validate password
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(30)                                  // Maximum length 100
.has().uppercase(1)                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().symbols(1)                                // Must have at least 1 symbols
.has().not().spaces()  

// Rules to validate email
const userValidationRules = () => {
    return [
        body('email').matches(emailRegex).trim().normalizeEmail().toLowerCase(),
    ]
}

// Check if datas are valid
const isDataValid = (req, res, next) => {
    const error = validationResult(req)

    if (!passwordSchema.validate(req.body.password)) {
        return res.status(422).json({ error })
    }

    if (error.isEmpty()) {
        return next()
    }
    return res.status(422).json({ error })
}

module.exports = { userValidationRules, isDataValid }