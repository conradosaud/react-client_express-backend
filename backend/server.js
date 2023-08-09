// Imports do ExpressJS
const express = require("express");
const app = express();
const PORT = 3003
// Outros imports
const cors = require("cors")
const bodyParser = require("body-parser");
const queryDatabase = require("./config/database");


// Middlewares
app.use(bodyParser.json());   // receber tudo em JSON
//app.use(cors({origin: "localhost:3000"}));                // liberar o acesso ao CORS
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))


// Rotas da API
const prefixo = "api/";
const host = "localhost:"+PORT+"/";

app.get('/', (req, res) => {
    const html = `
        <p>Rotas disponíveis:</p>
        <ul>
            <li> GET  - ${host + prefixo}buscaTodos
            <li> POST - ${host + prefixo}insere
        </ul>
    `
    res.send( html )
  })

app.get(`/api/buscaTodos`, (req, res)=>{

    const sql = 'SELECT * FROM itens ORDER BY id DESC;';
    queryDatabase(sql, (err, results) => {
        if (err) throw err;
        res.status(200).send(results);
    });

})

app.post(`/api/insere`, (req, res)=>{

    const texto = req.body.texto;

    const sql = `INSERT INTO itens (texto) VALUES ('${texto}');`;
    queryDatabase(sql, (err, results) => {
        if (err) throw err;
        res.status(201).send();
    });

})


// Inicia o servidor
app.listen( PORT, () => {
    console.log("Servidor backend rodando em "+host);
})