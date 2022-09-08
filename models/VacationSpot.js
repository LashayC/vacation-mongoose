//Creating the model for the vacation spots we want in the vacation database
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vacationSpotSchema = new Schema({
    destination: {type: String, unique: true}, 
    location: String,
    description: String,
    photo: String,
})

module.exports = mongoose.model('VacationSpot', vacationSpotSchema)

