
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
var express = require('express');
var app = express();
app.use(express.static("\public"));

if(!process.env.API_KEY){
    console.log("Api key isn't set!");
    process.exit();
}

let citiesData = {};
function initCitiesData(){
    fs.readFile("cities.json",function(err,data){
        if(err) console.log(err);
        citiesData = JSON.parse(data);
    })
}

function getData(cityId){
    return new Promise((resolve,reject)=>{
        let cord = "lon="+citiesData.cities[cityId].lon+"&lat="+citiesData.cities[cityId].lat;
        https.get('https://api.openweathermap.org/data/2.5/onecall?'+cord+`&exclude=current,minutely,hourly&appid=${process.env.API_KEY}&lang=tr&units=metric`, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
        data += chunk;
        });
        resp.on('end',() => {
            resolve(data);
        });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    });
}

app.get("/city",async function(req,res){
    await getData(req.query.cityId).then(function(response){
        res.send(response);
    });
});

initCitiesData();

app.listen(5500);