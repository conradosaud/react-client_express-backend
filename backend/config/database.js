require("dotenv").config();
const mysql = require("mysql2"); // conexão com banco MySQL

function queryDatabase(sql, values, callback = null) {

    // Idealmente ter esse objeto em um local seguro, por exemplo, em uma variável de ambiente (.env)
    const bd_info = {
        DB_HOST: "localhost",
        DB_USER: "root",
        DB_PASSWORD: "",
        DB_NAME: "bd_modelo"
    }

    const con = mysql.createConnection({
      host: bd_info.DB_HOST,
      user: bd_info.DB_USER,
      password: bd_info.DB_PASSWORD,
      database: bd_info.DB_NAME 
    });

    /* 
        // Tabela usada neste banco de modelo
        CREATE TABLE `itens` (
            `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            `texto` text DEFAULT NULL,
            `status` tinyint(1) DEFAULT 1,
            UNIQUE KEY `id` (`id`)
        ) 
    */
  
    con.connect( error => {

        if (error) {
            if(callback)
                callback(error);
            return;
        }

        con.query(sql, values, (err, results, fields) => {

            con.end();

            if(callback)
                callback(err, results);
            
        });

    });
}

module.exports = queryDatabase;