require("dotenv").config()
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const fetch = require("node-fetch"); //installed vers 2.6.6
const {ObjectId} = require('mongodb')
var port = process.env.PORT || 8090;

//Mongoose Code ==================================================================================================
const mongoose = require('mongoose')
const url = process.env.MONGO_CONNECTION
mongoose.connect(url, {useNewURLParser: true}) //Connects to db using mongoose

const db = mongoose.connection //To check whether connection has succeeded use open event. To check if failed use error event.
db.once('open', _ => {
    console.log('Database connected:', url)
})//

db.on('error', err => {
    console.error('connection error:', url)
})

/* 
Mongoose uses models to do crud operations on MongoDB. To create a Model, create a Schema(lets you define structure of an entry(aka document) in the collection)
You can use 10 dif kind values in Schema. 6 common = String/Num/Bool/Arr/Date/ObjectId
Files: In Mongoose, put each model in own file. For this its the VacationSpot.js model
    const Schema = mongoose.Schema 
    const schema = new Schema({})
*/


//We'll do Mongoose operations here-----------------------

const VacationSpot = require('./models/VacationSpot')// First load the VacationSpot model using require.

const tokyo = new VacationSpot({ //To create a vacation spot called tokyo, use 'new' + 'your model name' = 'new VacationSpot'. This creates Tokyo in memory.
    destination: 'Tokyo',
    location: 'Japan',
    description: 'During cherry blossom season',
    photo: 'https://unsplash.com/photos/layMbSJ3YOE'
})

tokyo.save(function (error, document) {//To save tokyo to db, run 'save' method.
    if(error){console.error(error)}
    console.log(document)
})



//Mongoose Code ==================================================================================================



// MongoClient.connect(process.env.MONGO_CONNECTION, { useUnifiedTopology: true })
//   .then((client) => {
//     console.log("Connected to Database");
//     const db = client.db("vacation-wishlist");
//     const wishlistCollection = db.collection("wishlist");

//     app.set("view engine", "ejs");

//     app.use(bodyParser.urlencoded({ extended: true }));
//     app.use(bodyParser.json());
//     app.use(express.static("public"));

//     app.disable('etag')

//     app.get("/", (req, res) => {
//       db.collection("wishlist")
//         .find()
//         .toArray()
//         .then((results) => {
//           console.log("app.get results", results);
//           res.render('index.ejs', {wishlist: results})

//         })
//         .catch((error) => console.error(error));
//     });


//     async function getVacationImage(location, destination){
//         let locationEncode = encodeURIComponent(location)
//         let destinationEncode = encodeURIComponent(destination)
        
//         try {
//             let response = await fetch( `https://api.unsplash.com/search/photos/?query=${(locationEncode,destinationEncode)}&orientation=landscape`, {
//                 headers: {
//                     'Authorization': `Client-ID ${process.env.PROJECT_API_KEY}`
//                 }
//             })

//             let result = await response.json()
//             // let imageURL = result.results[0].urls.thumb
//             return result.results[0].urls.thumb
//         } catch (error) {
//                 console.log(`error: ${error}`)
//         }
    
//     }

//        app.post('/wishlist', async (req, res) => {
//         let imageURL = await getVacationImage(req.body.location, req.body.destination)

//         wishlistCollection.insertOne({
//             destination: req.body.destination,
//             location: req.body.location,
//             description: req.body.description,
//             photo: imageURL
//         })
//             .then(result => {
//                 res.redirect('/')
//             })
//             .catch(error => console.error(error))
//             console.log(req.body)
//     })

//     app.put('/wishlist', async (req, res) => {
//         let imageURL = await getVacationImage(req.body.location, req.body.destination)

//         wishlistCollection.findOneAndUpdate(
//             {_id: ObjectId(req.body.cardObjectID)}, //1 query
//             {$set: {
//                 destination: req.body.destination,
//                 location: req.body.location,
//                 description: req.body.description,
//                 photo: imageURL
//             }}//2 update
//         )
//         .then(result => {
//             res.json('Success')
//             console.log('this is the result of app.put',result)
//         })
//         .catch(error => console.error(error))
//         console.log('this is body of app.put',req.body)
//     })

//     app.delete('/wishlist', (req, res) => {
//         wishlistCollection.deleteOne(
//             {_id: ObjectId(req.body.cardObjectID)} //query
//         )
//         .then(result => {
//             res.json('Deleted card')
//         })
//         .catch(error => console.error(error))
       
//     })
 
//     app.listen(port);
    
//   })
//   .catch((error) => console.error(error));
