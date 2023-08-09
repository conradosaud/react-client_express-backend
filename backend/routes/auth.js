const passport = require("passport");
require("./../config/passport")(passport)
const queryDatabase = require("./../config/database");

const route = require("express").Router();

// ----------------------  GET  -----------------------
route.get("/isAuthenticated", (req, res) => {
    res.status(200).send( req.isAuthenticated() );
})

// ----------------------  POST  ----------------------
route.post("/login", async ( req, res, next) => {

    const response = await isUserBlocked(req.ip);
    if( response == true ){
        res.status(403).send();
        return;
    }

    passport.authenticate("local", (err,user,info) => { 
        if( err ) throw err;
        if(!user){
            addAttempts(req.ip, true);
            res.status(404).send("No user exists");
        }
        else{
            req.logIn(user, err => {
                if(err) throw err;
                addAttempts(req.ip, false, 1, user.id);
                const userResponse = {
                    id: user.id,
                    name: user.name,
                    level: user.level
                }
                res.send(userResponse);
            })
        }
    })(req, res, next) 
})

route.post("/logout", ( req, res, next) => {
    req.logout((err)=> {
        if( err ){
            res.status(500).send(err)
        }else{
            res.status(200).send()
        }
    });
})

const addAttempts = ( user_ip, add, result = null, user_id = null) => {
    add = add == true ? "attempts+1":0;
    result = result == null ? 0 : 1;
    const user_id_query = user_id == null ? "" : `user_id = ${user_id},`;
    const sql = `UPDATE authentication_log SET attempts = ${add}, ${user_id_query} date = NOW(), result = ${result} WHERE user_ip = '${user_ip}'`;
    queryDatabase(sql, []);
    
}

const createUserAuthenticationLog = (user_ip, result) => {
    const sql = `INSERT INTO authentication_log (user_ip, result, attempts) VALUES ('${user_ip}', ${result}, 0);`;
    queryDatabase(sql, []);
}

const isUserBlocked = ( user_ip ) => 
new Promise( resolve => {

    const sql = "SELECT * FROM authentication_log WHERE user_ip = ?";
    queryDatabase(sql, [user_ip], (err, results) => {

        if(err) throw err;

        if( results == 0 ){
            createUserAuthenticationLog(user_ip, 0);
            return resolve(false);
        }

        if( results[0].attempts < 3 )
            return resolve(false);

        const hour_interval = 1; // Hours interval between attempts after being blocked
        const sql = "SELECT TIMESTAMPDIFF(HOUR, date, CURRENT_TIMESTAMP) >= ? FROM authentication_log WHERE user_ip = ?";
        queryDatabase(sql, [hour_interval, user_ip], (err, results) => {
            const interval = results[0][Object.keys(results[0])[0]];
            if( interval >= 1 ){
                addAttempts(user_ip, false);
                resolve(false);
            }else{
                addAttempts(user_ip, true);
                resolve(true);
            }
        });
        
    });

})

module.exports = route;