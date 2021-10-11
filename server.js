'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const server = express();
server.use(cors());

server.use(express.json());

const PORT = 3010;

// Mongo DB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Modelfruits;


// Routes
server.get('/', homeHandler);
server.get('/getFruits', GetFruitDataHandler);
server.post('/addToFavorites', AddToFavHandler);
server.get('/getFavoriteFruits', GetFavFruitsData);
server.delete('/deleteItem/:id/:email', DeleteItemHandler);
server.put('/updateFavFruit/:id', UpdateFavItems);

main().catch(err => {
    console.log(err);
});

async function main() {
    // await mongoose.connect('mongodb://localhost:27017/301Exam');
      await mongoose.connect('mongodb://FruitsBasket:199624@cluster0-shard-00-00.dpyre.mongodb.net:27017,cluster0-shard-00-01.dpyre.mongodb.net:27017,cluster0-shard-00-02.dpyre.mongodb.net:27017/FruitsBasket?ssl=true&replicaSet=atlas-a6ifku-shard-0&authSource=admin&retryWrites=true&w=majority');


    const FruitSchema = new Schema({
        name: String,
        photo: String,
        price: String,
        email: String
    });
    Modelfruits = mongoose.model("FruitBasket", FruitSchema)
}





// Functions Handlers
function homeHandler(req, res) {
    res.send('Home Page');
}


// to get the data from the API link by using axios to make request.
function GetFruitDataHandler(req, res) {
    const url = 'https://fruit-api-301.herokuapp.com/getFruit';
    axios
        .get(url)
        .then(result => {
            res.send(result.data);
            // console.log(result.data);
        })
        .catch(err => {
            console.log(err);
        })

}

// to add the selected fruits by clicking into favoruites page
function AddToFavHandler(req, res) {
    const { name, photo, price, email } = req.body;

    Modelfruits.create({ name, photo, price, email }, (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(result);
        }
    })
}

function GetFavFruitsData(req, res) {

    const userEmail = req.query.email;

    Modelfruits.find({ email: userEmail }, (err, result) => {
        console.log(userEmail);

        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
            console.log(result);
        }
    })
    console.log(Modelfruits);
}

function DeleteItemHandler(req, res) {
    const id = req.params.id;
    const email = req.params.email;

    // const { email } = req.body;

    console.log('from server side',id,email);
    Modelfruits.deleteOne({ _id: id }, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            
            
        }
    })
    Modelfruits.find({ email: email }, (err, result) => {
        // console.log(userEmail);

        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    })
}

function UpdateFavItems(req, res) {
    const id = req.params.id;

    // structuring
    const { fruitName, fruitPrice, fruitImage, email } = req.body;

    Modelfruits.findByIdAndUpdate(id, { name: fruitName, price: fruitPrice, photo: fruitImage }, (err, result) => {

        Modelfruits.find({ email: email }, (err, result) => {
            console.log(email);

            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        })
    })


}


// Ckeck if listeing
server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})