
require("dotenv").config()
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
// const MongoClient = require("mongodb").MongoClient;
const fetch = require("node-fetch"); //installed vers 2.6.6
const {ObjectId} = require('mongodb')
var port = process.env.PORT || 8000;
const mongoose = require('mongoose')
// const url = process.env.MONGO_CONNECTION
const configDB = require('./config/database.js')
const url = configDB.url




//Mongoose Code ==================================================================================================
// mongoose.connect(url, {useNewURLParser: true}) //Connects to db using mongoose

// const db = mongoose.connection //To check whether connection has succeeded use open event. To check if failed use error event.
// db.once('open', _ => {
//     console.log('Database connected:', url)
//     app.listen(port, () => console.log(`Server running on port ${port}`))
// })//

// db.on('error', err => {
//     console.error('connection error:', url)
// })
// const VacationSpot = require('./models/VacationSpot')// First load the VacationSpot model using require.


/*
/* 
Mongoose uses models to do crud operations on MongoDB. To create a Model, create a Schema(lets you define structure of an entry(aka document) in the collection)
You can use 10 dif kind values in Schema. 6 common = String/Num/Bool/Arr/Date/ObjectId
Files: In Mongoose, put each model in own file. For this its the VacationSpot.js model
    const Schema = mongoose.Schema 
    const schema = new Schema({})
*/

//---- We'll do Mongoose operations here -------------------------------------------------------

/*//---- Do save operation with synchronous code
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
*/

/*//---- Redo the save operation with Promises
function saveVacationSpot(vacationSpot){
    const v = new VacationSpot(vacationSpot)
    return v.save()
}

saveVacationSpot({
    destination: 'Tokyo',
    location: 'Japan',
    description: 'During cherry blossom season',
    photo: 'https://unsplash.com/photos/layMbSJ3YOE'
})
.then(doc => {console.log(doc)})
.catch(error => {console.error(error)})
*/

//--- Redo the save operation with Async/Await

// async function runCode(){   //You can use the unique option in the model to ensure 2 dif docs can't have same name.
//     //---------------Mongoose save and delete methods
//     const pyramids = new VacationSpot({
//         destination: 'Pyramids',
//         location: 'Egypt',
//         description: 'Bring sunscreen',
//         photo: 'https://unsplash.com/photos/H3ugdzHeh2I'
//     })
//     const doc = await pyramids.save() //Saves entry to db
//     // await VacationSpot.deleteMany({}) //This deletes all entries in vacationspot db/
//     console.log(doc)

    //---------------Mongoose has 2 methods to find stuff from db: findOne = get one doc // find = get array of docs
    // const tokyo = await VacationSpot.findOne({destination: 'Tokyo'}) //gives Tokyo
    // const tokyo = await VacationSpot.find({destination: 'Tokyo'})
    // const spots = await VacationSpot.find() //gives all docs
    // console.log(spots)

    //----------------Mongoose has 2 ways to update docs. 'findOne + save' orr 'findOneAndUpdate'
    //++++++Update using findOne method++++++
    // const tokyo = await VacationSpot.findOne({destination: 'Tokyo'}) 
    // tokyo.cost = 300 //adding on cost and packinglist using dot notation, then saving to db.
    // tokyo.packingList = ['Hat', 'Shoes', 'Keys']
    // const doc = await tokyo.save()
    // console.log(doc)
    //++++++Update using findOneAndUpdate method++++++
    //fidnOneAndUpdate(filter,update)syntax
    // const doc = await VacationSpot.findOneAndUpdate(
    //     {destination: 'Pyramids'},
    //     {
    //         cost: 500,
    //         packingList: ['Sunscreen', 'Lotion', 'Water']
    //     }
    // )
    // console.log(doc)
    //++++ first option is easier to read. Second option doesn't trigger the 'save' middleware. First option findone+save best to use +++++++

    //----------------Mongoose 2 ways to delete docs. 'findOne + remove' orr 'findOneAndDelete'
    //+++++++++ Delete using findOne + remove method ++++++
    // const tokyo = await VacationSpot.findOne({destination: 'Tokyo'})
    // const deleted = await tokyo.remove()
    //+++++++++ Delete using findOneAndDelete method +++++++
    // const deleted = await VacationSpot.findOneAndDelete({destination: 'Pyramids'})
// }

// runCode()
//     .catch(error => {console.error(error)})




//Mongoose Code ==================================================================================================

mongoose.connect(url, {useNewURLParser: true, useUnifiedTopology: true}) //Connects to db using mongoose

const db = mongoose.connection //To check whether connection has succeeded use open event. To check if failed use error event.
db.once('open', _ => {
    console.log('Database connected:', url)
    app.listen(port, () => console.log(`Server running on port ${port}`))
})//

db.on('error', err => {
    console.error('connection error:', url)
})
const VacationSpot = require('./models/VacationSpot')// First load the VacationSpot model using require.


    app.set("view engine", "ejs");

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static("public"));

    app.disable('etag')

    app.get("/", async(req, res) => {
    //   db.collection("wishlist")
    //     .find()
    //     .toArray()
    //     .then((results) => {
    //       console.log("app.get results", results);
    //       res.render('index.ejs', {wishlist: results})

    //     })
    //     .catch((error) => console.error(error));

        try {
            const spots = await VacationSpot.find() //gives all docs
            res.render('index.ejs', {vacationspots: spots})
            console.log("app.get results", spots);
        } catch (error) {
            console.error(error)
        }
    });


    async function getVacationImage(location, destination){
        let locationEncode = encodeURIComponent(location)
        let destinationEncode = encodeURIComponent(destination)
        
        try {
            let response = await fetch( `https://api.unsplash.com/search/photos/?query=${(locationEncode,destinationEncode)}&orientation=landscape`, {
                headers: {
                    'Authorization': `Client-ID ${process.env.PROJECT_API_KEY}`
                }
            })

            let result = await response.json()
            // let imageURL = result.results[0].urls.thumb
            return result.results[0].urls.thumb
        } catch (error) {
                console.log(`error: ${error}`)
        }
    
    }

       app.post('/wishlist', async (req, res) => {
        let imageURL = await getVacationImage(req.body.location, req.body.destination)

        // wishlistCollection.insertOne({
        //     destination: req.body.destination,
        //     location: req.body.location,
        //     description: req.body.description,
        //     photo: imageURL
        // })
        //     .then(result => {
        //         res.redirect('/')
        //     })
        //     .catch(error => console.error(error))
        //     console.log(req.body)



        try {

            const vacationEntry = new VacationSpot({
                destination: req.body.destination,
                location: req.body.location,
                description: req.body.description,
                photo: imageURL
            })
            const doc = await vacationEntry.save() 
            res.redirect('/')
            console.log('this is app.post req.body',req.body)

        } catch (error) {
            console.error(error)
        }
    })

    app.put('/wishlist', async (req, res) => {
        let imageURL = await getVacationImage(req.body.location, req.body.destination)

        // wishlistCollection.findOneAndUpdate(
        //     {_id: ObjectId(req.body.cardObjectID)}, //1 query
        //     {$set: {
        //         destination: req.body.destination,
        //         location: req.body.location,
        //         description: req.body.description,
        //         photo: imageURL
        //     }}//2 update
        // )
        // .then(result => {
        //     res.json('Success')
        //     console.log('this is the result of app.put',result)
        // })
        // .catch(error => console.error(error))
        // console.log('this is body of app.put',req.body)



        // fidnOneAndUpdate(filter,update)syntax
           try {
            let imageURL = await getVacationImage(req.body.location, req.body.destination)

             const updatedDoc = await VacationSpot.findOneAndUpdate(
                 {_id: ObjectId(req.body.cardObjectID)},
                 {
                     destination: req.body.destination,
                     location: req.body.location,
                     description: req.body.description,
                     photo: imageURL
                 }
             )
             res.json('Success')
            //  console.log('UpdatedDoc from post',updatedDoc)
           } catch (error) {
            console.error(error)
           }
        //    console.log('this is body of app.put',req.body)

    })

    app.delete('/wishlist', async(req, res) => {
        // wishlistCollection.deleteOne(
        //     {_id: ObjectId(req.body.cardObjectID)} //query
        // )
        // .then(result => {
        //     res.json('Deleted card')
        // })
        // .catch(error => console.error(error))
       
        try {
            const deleted = await VacationSpot.findOneAndDelete({_id: ObjectId(req.body.cardObjectID)})
            res.json('Deleted card')
        } catch (error) {
            console.error(error)
        }
       
    })
 
    // app.listen(port);
    

  
