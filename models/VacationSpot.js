//Creating the model for the vacation spots we want in the vacation database

//Create the Schema
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//What you want in db and how they can be represented.
const vacationSpotSchema = new Schema({
    destination: String,
    location: String,
    description: String,
    photo: String
})

//Create model using mongoose method 'model' and use module.exports(tells node which code to export from a file so other files can access it)
module.exports = mongoose.model('VacationSpot', vacationSpotSchema)

