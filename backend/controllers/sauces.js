const Sauce = require('../models/sauce')
const fs = require('fs')

// Create new sauce 
exports.uploadSauce = async(req, res, next) => {
    const sauce = new Sauce({
        userId: req.authUserId, // auth user id from database not from client
        ...req.body.sauce,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //add path 
    })
    try {
        await sauce.save()
        res.status(201).json({ message: 'Sauce registered' })
    } catch (error) {
        res.status(400).json({ error })
    }
}

// Get all sauces from database
exports.getAllSauces = async(req, res, next) => {
    try {
        let sauces = await Sauce.find()
        res.status(200).json(sauces)
    } catch (error) {
        res.status(400).json({ error })
    }
}

// Get one sauce from database
exports.getOneSauce = async(req, res, next) => {
    try {
        let sauce = await Sauce.findOne({ _id: req.params.id })
        res.status(200).json(sauce)
    } catch (error) {
        res.status(400).json({ error })
    }
}

// Delete sauce in database and the image from the image file
exports.deleteSauce = async(req, res, next) => {
    let sauce

    try {
        sauce = await Sauce.findOne({ _id: req.params.id })
    } catch (error) {
        res.status(400).json({ error })
    }

    const fileName = sauce.imageUrl.split('/images/')[1]

    try {
        fs.unlink(`images/${fileName}`, () => {
            sauce.deleteOne()
        })
        res.status(200).json({ message: 'Sauce deleted' })
    } catch (error) {
        res.status(400).json({ error })
    }
}

// Modify sauce with file or not
exports.modifySauce = async(req, res, next) => {
    let sauce = req.file ? {
        userId: req.authUserId, // auth user id from database not from client
        ...req.body.sauce,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body }

    // Delete the old image if a new one is added 
    if (req.file) {
        let oldSauce = await Sauce.findOne({ _id: req.params.id })
        const fileName = oldSauce.imageUrl.split('/images/')[1]

        try {
            fs.unlink(`images/${fileName}`, (error) => {
                if (error) throw error;
            });

        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    try {
        await Sauce.updateOne({ _id: req.params.id }, {...sauce, _id: req.params.id })
        return res.status(200).json({ message: 'Sauce modified' })

    } catch (error) {
        return res.status(400).json({ message: 'Cannot update' })
    }
}

// Modify the like.dislike of one sauce
exports.like = async(req, res, next) => {
    const filter = { _id: req.params.id }
    const updateUsersLiked = { usersLiked: req.authUserId }
    const updateUsersDisliked = { usersDisliked: req.authUserId }

    let sauce = await Sauce.findById({ _id: req.params.id })

    if (!sauce) {
        return res.status(404).json({ message: 'Sauce not Found' })
    }

    // Check if the user has already liked the sauce 
    const userHasLiked = sauce.usersLiked.includes(req.authUserId)
    // Check if the user has already disliked the sauce 
    const userHasDisliked = sauce.usersDisliked.includes(req.authUserId)
    // Get the value of req.body.like
    const { like } = req.body

    // check if a user is trying to like.dislike a sauce more than one 
    if ([-1, 1].includes(like) && (userHasLiked || userHasDisliked)) {
        return res.status(401).json({ message: "Unauthorized action" })
    }

    // Switch for updating the like.dislike 
    try {
        switch (like) {
            case 1: // LIKE
                await Sauce.findByIdAndUpdate(filter, {
                    $addToSet: updateUsersLiked,
                    $inc: { likes: 1 }
                })
                break;

            case 0: // CANCELLATION

                const pullFunc = userHasLiked ? updateUsersLiked : updateUsersDisliked,
                    incField = userHasLiked ? "likes" : "dislikes"

                await Sauce.findByIdAndUpdate(filter, {
                    $pull: pullFunc,
                    $inc: {
                        [incField]: -1
                    }
                })
                break;

            case -1: // DISLIKE
                await Sauce.findByIdAndUpdate(filter, {
                    $addToSet: updateUsersDisliked,
                    $inc: { dislikes: 1 }
                })
                break;
        }

        return res.status(200).json({ message: 'like accepted' })
    } catch (error) {
        return res.status(400).json({ error })
    }
}