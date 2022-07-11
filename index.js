const express = require('express')
const { default: rateLimit } = require('express-rate-limit')
require('dotenv').config()
const port = 5000
const fs = require('fs')

const app = express()
const limiter = rateLimit({
    max: 50,
    windowMs: 10000,
})

const Attractions = [
    {
        name:'27 Charcos de Damajagua',
        city: 'Puerto Plata',
        description: 'Puerto Plata’s crown jewel attraction, the 27 Charcos of Damajagua waterfalls offer a day of hiking through thick forest, crossing footbridges and passing numerous flora before eventually reaching a rocky hilltop where you’ll begin making your way down by jumping or sliding down a series of waterfalls–helmets and safety gear on–as you slide down water-cushioned chutes or jump into deep turquoise pools. Most excursions take you only through seven falls, as reaching the 27th is reserved for the most active and physically fit adventurers. Run by local guides who live within the community, the park entrance fees benefit all of its residents, making it a win for all. The park is located approximately an hour from Puerto Plata city. Make it through the 27 Charcos de Damajagua and you can face any other adventure in the DR!',
        categories: ['ecoturismo', 'waterfalls', 'national parks'],
        phone: '829-123-4567',
        web: 'www.google.com',
        address: '',
        coords: [19.734461408663723, -70.81915850610692]
    },
    {
        name:'Anfiteatro La Puntilla',
        city: 'Puerto Plata',
        description: 'Inaugurated in April 2017, Puerto Plata’s newest outdoor venue, La Puntilla, is a stunning 2,062 square meter (22,200 square foot) outdoor Grecian amphitheater facing the Atlantic Ocean, with a capacity of over 4,000 spectators. Flanked by the San Felipe Fort on one side, and a verdant La Puntilla park, concerts, dance performances, and other artistic events are occasionally held here, featuring Dominican and international artists.',
        categories: ['theaters', 'beach'],
        phone: '829-123-4567',
        web: 'www.google.com',
        coords: [19.805380124769105, -70.69596976057431]
    },
    {
        name:'Bartolo Colón Stadium',
        city: 'Puerto Plata',
        description: 'Located in the small town of Altamira, birthplace of Major League player Bartolo Colón, the professional player built this stadium and academy to facilitate training for the children of his community. An on-site museum showcases an excellent overview of Dominican baseball, its history, and cultural importance. You’ll also spot some of Colón’s belongings, including his uniforms and bats. Head out to the baseball stadium, where you can watch and join the area’s youth practicing all day and chasing their dream of becoming the next MLB sensation.',
        categories: ['museum'],
        phone: '829-123-4567',
        web: 'www.google.com',
        coords: [19.650537051356146, -70.83322412704511]
    },
    {
        name:'Arena Del Cibao',
        city: 'Puerto Plata',
        description: 'A modern basketball facility hosts the tournaments (usually in the spring) that pit different sections of the city against each other in an all-out battle for the city championship. Regional and national championship games are played here during the summer. The local basketball team is called the “Metros”.',
        categories: ['sport'],
        phone: '829-123-4567',
        web: 'www.google.com',
        coords: [19.465499442905852, -70.70962973046699]
    },
]

app.get('/', limiter, (req, res) =>{
    res.send('API LIVE')
})

app.get('/attractions', limiter, (req, res) =>{
    res.status(200).send(Attractions)
})

app.get('/attractions/images/:name', limiter, (req, res ) =>{

    const file = `${__dirname}/images/attractions/${req.params.name}`

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

app.listen(port, () => console.log(`Listening on port ${port}`))