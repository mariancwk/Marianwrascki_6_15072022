const { check, validationResult } = require("express-validator");
const fs = require("fs");

// Rules to validate sauce
const sauceRules = () => {
    const regexAlphaNumSpace = /^[a-zA-Z0-9 ]*$/;

    return [
        check("sauce.name")
        .custom((value) => {
            return value.match(regexAlphaNumSpace);
        })
        .isLength({ min: 1, max: 20 }),
        check("sauce.manufacturer")
        .custom((value) => {
            return value.match(regexAlphaNumSpace);
        })
        .isLength({ min: 1, max: 20 }),
        check("sauce.description")
        .custom((value) => {
            return value.match(regexAlphaNumSpace);
        })
        .isLength({ min: 1, max: 150 }),
        check("sauce.mainPepper")
        .custom((value) => {
            return value.match(regexAlphaNumSpace);
        })
        .isLength({ min: 1, max: 20 }),
        check("sauce.heat").isNumeric().isLength({ min: 1, max: 10 }),
    ];
};

// Check if datas are valid
const isSauceValid = (req, res, next) => {
    const error = validationResult(req);

    if (error.isEmpty()) {
        return next();
    }

    if (!req.file) {
        return next();
    }

    try {
        fs.unlink(`images/${req.file.filename}`, (error) => {
            if (error) throw error;
        });
    } catch (error) {
        return res.status(400).json({ message: "Sauce " });
    }

    return res.status(422).json({ error });
};

module.exports = { sauceRules, isSauceValid };