const mongoose = require('mongoose')
const axios = require('axios')
const Path = require('path')
const Fs = require('fs')  

const XLSX = require("xlsx"); 
const Places = require('./models/Places')

const readExports = async () =>{
    const wb = XLSX.readFile(`${__dirname}/english.csv`);
    const sheets = wb.SheetNames;
    
    if (sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);

        for (let i in data){
            const row = data[i]
            let coords
            let address 
            
            const name = row.Title.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')

            if(row['Image Featured']){
                await downloadImage(row['Image Featured'], row.Title)
            }

    
            if(row['POI lat'] && row['POI lat'].length > 1 && row['POI long'] && row['POI long'].length){
                coords = {
                    latitude:  row['POI lat'],
                    longitude: row['POI long']
                }
            } else {
                try{

                    const tempTitle = row.Title.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
                    const googleResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${tempTitle}, ${row.Destinations}, Republica Dominicana&key=AIzaSyBJFVaSvH1iARwHPc1KeqCieoCcsnB0Y6s`)
                    
                    
                    coords = {
                        latitude: googleResponse.data.results[0].geometry.location.lat,
                        longitude: googleResponse.data.results[0].geometry.location.lng
                    }
                    address = googleResponse.data.results[0].formatted_address
    
                   await delay(500)
                } catch(err){
                   console.log(err)
                }
    
            }
    
            const place = new Places({
                name: row.Title,
                city: row.Destinations,
                description: row.Content,
                web: row['content'] ? row['content'] : null,
                phone: row['phone'] ? row['phone' ] : null,
                coords: coords || null,
                language: row['WPML Language Code'],
                address: address || null
    
            })
            
            const updateResponse = await place.save()
    
        }
    
    } 
}

readExports()

async function downloadImage (url, name) {  
    const path = Path.resolve(__dirname, 'images/places', name + '.jpg')
    const writer = Fs.createWriteStream(path)
  
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
  
    response.data.pipe(writer)
  
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }

function delay(delayInms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }

app.listen(port, () => console.log(`Listening on port ${port}`))