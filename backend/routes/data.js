const route = require("express").Router();

const fs = require('fs');
const csv = require('csv-parser');

const json_path = "./app/data/json/";
const csv_path = "./app/data/csv/";

route.get('/getAll/:data_frame', (req, res) => {
    
    if(req.isAuthenticated() == false) return res.status(403).send();
    
    const file = "general/"+req.params.data_frame+".json";
    fs.readFile( json_path + file , (err, data) => {
        if (err)
            return res.json( { error: err } ).status(500);
        res.send( JSON.parse( data ) ).status(200);
    });
});

route.get('/user/:user_id/:data_frame', (req, res) => {

    if(req.isAuthenticated() == false) return res.status(403).send();

    const file =  req.params.data_frame + "/" + req.params.user_id + ".json";
    fs.readFile( json_path + file , (err, data) => {
        if (err)
            return res.json( { error: err } ).status(500);

        try{ 
            res.status(200).send( JSON.parse( data ) );
        }catch(err){
            res.status(200).send()
        }
    });
});

module.exports = route;