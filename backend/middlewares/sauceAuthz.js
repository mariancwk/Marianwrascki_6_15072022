const Sauce = require('../models/sauce')

// Check if the user is the owner of the sauce 
module.exports = async(req, res, next) => {
    let sauce

    try {
        sauce = await Sauce.findOne({ _id: req.params.id })
    } catch (error) {
        res.status(400).json({ error })
    }

    try {
        if (sauce.userId !== req.authUserId) {
            return res.status(401).json({ error: 'Invalid user!' })
        }
        next()

    } catch (error) {
        res.status(400).json({ error: 'Invalid request!' })
    }
}