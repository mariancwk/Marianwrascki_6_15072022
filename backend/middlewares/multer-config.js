const multer = require('multer')
const fs = require("fs")

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
}

const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
  ]


const storage = multer.diskStorage({
    // Create a case if he doesn't exist
    destination: (req, file, callback) => {
        fs.mkdirSync('images', { recursive: true })
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0].split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        
        // Validate the file uploaded 
        if (!whitelist.includes(file.mimetype)) {
          return callback(new Error('file is not allowed'))
        }
        callback(null, name + '_' + Date.now() + '.' + extension)
    },
})

module.exports = multer({ storage }).single('image')