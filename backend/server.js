// Imports e configurações do ExpressJS
const express = require("express");
const app = express();
const PORT = 3003
const host = "localhost:"+PORT;
// Outros imports
const cors = require("cors")
const bodyParser = require("body-parser");
const queryDatabase = require("./config/database");


// Middlewares
app.use(bodyParser.json());   // receber tudo em JSON
app.use(cors({               // liberar o acesso ao CORS
    origin: "http://localhost:3000",
    credentials: true
}))

/* ------ ROTAS DA API ------ */ 

// GET /
app.get('/', (req, res) => {
    const html = `
        <p>Rotas disponíveis:</p>
        <ul>
            <li> GET  - ${host}/buscaTodos
            <li> POST - ${host}/insere
        </ul>
    `
    res.send( html )
  })

// GET /api/buscaTodos
app.get(`/api/buscaTodos`, (req, res)=>{

    const sql = 'SELECT * FROM itens ORDER BY id DESC;';
    queryDatabase(sql, (err, results) => {
        if (err) throw err;
        res.status(200).send(results);
    });

})

// POST /api/insere
app.post(`/api/insere`, (req, res)=>{

    const texto = req.body.texto;

    const sql = `INSERT INTO itens (texto) VALUES ('${texto}');`;
    queryDatabase(sql, (err, results) => {
        if (err) throw err;
        res.status(201).send();
    });

})

/* ------ FIM DAS ROTAS ------ */

// Inicia o servidor
app.listen( PORT, () => {
    console.log("Servidor backend rodando em "+host);
})