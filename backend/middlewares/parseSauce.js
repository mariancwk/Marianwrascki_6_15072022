// Parse the req format if the req contain a file 
module.exports = (req, res, next) => {
    if (!req.file) {
        return next()
    }

    try {
        req.body.sauce = JSON.parse(req.body.sauce) 
        next()
    } catch (error) {
        return res.status(400).json({ error })
    }
}