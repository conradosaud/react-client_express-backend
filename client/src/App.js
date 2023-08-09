
import './App.css';
import Apresentacao from './components/Apresentacao';
import Listagem from './components/Listagem';
import Cadastro from './components/Cadastro';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

    const [ lista, alteraLista ] = useState( [] )

    function buscaTodos(){
        axios.get("http://localhost:3003/api/buscaTodos")
        .then( resposta => {
            alteraLista(resposta.data)
        })
        .catch( resposta => {
            console.log(resposta)
            console.log("Erro ao buscar dados")
        })
    }

    function insere( obj ){
        axios.post("http://localhost:3003/api/insere", obj)
        .then(()=> {
            buscaTodos();
        })
        .catch(()=>{
            alert("Erro ao inserir novo item...")
            return;
        })
    }
    
    useEffect(()=> {
        buscaTodos();
    }, [])

    return (
        <div>
        
            <Apresentacao/>

            <div className="flex">
                <Cadastro insere={insere} />
                <Listagem lista={lista} />
            </div>

        </div>
    );
}

export default App;
