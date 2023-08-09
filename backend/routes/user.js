const passport = require("passport");
require("./../config/passport")(passport)
const bcrypt = require("bcryptjs");
const queryDatabase = require("./../config/database");

const route = require("express").Router();

// ----------------------  GET  ----------------------

route.get("/getAll", (req, res)=>{
    if( !req.isAuthenticated() || req.user.level != 1 ) 
        return res.status(403).send()

    const sql = 'SELECT * FROM user_safe_columns ORDER BY created_at DESC;';
    queryDatabase(sql, (err, results) => {
        if (err) throw err;
        res.status(200).send(results);
    });

})

// ---------------------  POST  ----------------------
route.post("/create", (req, res) =>{
    if( !req.isAuthenticated() || req.user.level != 1 )
        return res.status(403).send()

    bcrypt.hash( req.body.password, 10 )
    .then( hash => insert(hash) )

    function insert(hash){
        const user = req.body;
        user.password = hash;
        const sql = 'INSERT INTO users SET ?';
        queryDatabase(sql, user, (err, results) => { 
            if (err)
                return res.status(400).send(err);
            res.status(201).send(results); 
        });
    }

}) 

// ---------------------  DELETE  ----------------------
route.delete("/delete/:id", (req, res) => {
    if( !req.isAuthenticated() || req.user.level != 1 )
        return res.status(403).send()

    const sql = 'DELETE FROM users WHERE id = ?';
    queryDatabase(sql, [req.params.id], (err, results) => {
        if (err)
            return res.status(400).send(err);
        res.status(200).send(results);
    });

}) 

module.exports = route;