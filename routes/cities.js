const express = require('express')
const path = require('path');
const fs = require('fs')
const { default: rateLimit } = require('express-rate-limit')

const router = express.Router()

const limiter = rateLimit({
    max: 50,
    windowMs: 10000,
})

const Cities = ['Santo Domingo', 'Puerto Plata', 'Santiago']

router.get('/', limiter, (req, res) =>{
    res.status(200).send(Cities)
})

router.get('/cities/:name', limiter, (req, res ) =>{

    const actualDir = path.join(__dirname, '..')

    const file = `${actualDir}/images/cities/${req.params.name}`

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