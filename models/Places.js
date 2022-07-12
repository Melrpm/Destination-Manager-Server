const mongoose = require('mongoose')

const PlacesSchema = mongoose.Schema(
    {
        name: {
            type:String,
            required: true
        },
        city: {
            type:String,
            required: true
        },
        description: {
            type:String,
            required: true
        },
        categories: {
            type:String,
            required: false
        },
        phone: {
            type:String,
            required: false
        },
        web: {
            type:String,
            required: false
        },
        address: {
            type:String,
            required: false
        },
        language: {
            type:String,
            required: true
        },
        coords: {
            type:Object,
            required: false
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model('Places', PlacesSchema)