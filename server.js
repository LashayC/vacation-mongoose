require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const fetch = require("node-fetch");
const { ObjectId } = require("mongodb");
var port = process.env.PORT || 8000;
const mongoose = require("mongoose");
const configDB = require("./config/database.js");
const url = configDB.url;
const VacationSpot = require("./models/VacationSpot");

//Mongoose connected to db
mongoose.connect(url, { useNewURLParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.once("open", (_) => {
  console.log("Database connected:", url);
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

db.on("error", (err) => {
  console.error("connection error:", url);
});

//Express and Mongoose operations
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.static("public"));

app.disable("etag");

app.get("/", async (req, res) => {
  try {
    const spots = await VacationSpot.find();
    res.render("index.ejs", { vacationspots: spots });
    console.log("app.get results", spots);
  } catch (error) {
    console.error(error);
  }
});

async function getVacationImage(location, destination) {
  let locationEncode = encodeURIComponent(location);
  let destinationEncode = encodeURIComponent(destination);

  try {
    let response = await fetch(
      `https://api.unsplash.com/search/photos/?query=${
        (locationEncode, destinationEncode)
      }&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.PROJECT_API_KEY}`,
        },
      }
    );

    let result = await response.json();
    // let imageURL = result.results[0].urls.thumb
    return result.results[0].urls.thumb;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

app.post("/wishlist", async (req, res) => {
  try {
    let imageURL = await getVacationImage(
      req.body.location,
      req.body.destination
    );

    const vacationEntry = new VacationSpot({
      destination: req.body.destination,
      location: req.body.location,
      description: req.body.description,
      photo: imageURL,
    });
    const doc = await vacationEntry.save();
    res.redirect("/");
    console.log("this is app.post req.body", req.body);
  } catch (error) {
    console.error(error);
  }
});

app.put("/wishlist", async (req, res) => {
  try {
    let imageURL = await getVacationImage(
      req.body.location,
      req.body.destination
    );

    const updatedDoc = await VacationSpot.findOneAndUpdate(
      { _id: ObjectId(req.body.cardObjectID) },
      {
        destination: req.body.destination,
        location: req.body.location,
        description: req.body.description,
        photo: imageURL,
      }
    );
    res.json("Success");
    //  console.log('UpdatedDoc from post',updatedDoc)
  } catch (error) {
    console.error(error);
  }
  //    console.log('this is body of app.put',req.body)
});

app.delete("/wishlist", async (req, res) => {
  try {
    const deleted = await VacationSpot.findOneAndDelete({
      _id: ObjectId(req.body.cardObjectID),
    });
    res.json("Deleted card");
  } catch (error) {
    console.error(error);
  }
});
