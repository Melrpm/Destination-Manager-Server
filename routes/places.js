const express = require('express')
const path = require('path');
const fs = require('fs')
const { default: rateLimit } = require('express-rate-limit')
const Places = require('../models/Places')

const router = express.Router()

const limiter = rateLimit({
    max: 50,
    windowMs: 10000,
})

router.get('/', limiter, async (req, res) =>{
    const response = await Places.find()
    res.status(200).send(response)
})

router.get('/:name', limiter, async (req, res) =>{
    const city = req.params.name
    const response = await Places.find({city})
    res.status(200).send(response)
})

router.get('/images/:name', limiter, (req, res ) =>{

    const actualDir = path.win32.join(__dirname, '..').replace("\\","/")

    const file = `${actualDir}/images/places/${req.params.name}`
    console.log(req.params.name)
    /* console.log(path.normalize(file)) */

    const checkPermissions = file => {
        try {
          fs.accessSync(file, fs.constants.R_OK);
          return true;
        } catch (err) {
          return false;
        }
    };
    
    if (checkPermissions(file)){
        const imageBuffer = fs.readFileSync(file)
        res.setHeader('Content-Type', 'image/jpg')
        res.send(imageBuffer)
        /* res.sendFile(file); */
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/plain',
        })
        return res.end('Not such image')
    }

})

module.exports = router