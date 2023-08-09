
import './App.css';
import Apresentacao from './components/Apresentacao';
import Listagem from './components/Listagem';
import Cadastro from './components/Cadastro';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

    // useState atualiza o estado de um elemento em tempo real
    // essa variável é responsável por transitar as informações da lista para todos os componentes da aplicação
    const [ lista, alteraLista ] = useState( [] )

    // Realiza a consulta GET na API
    function buscaTodos(){
        axios.get("http://localhost:3003/api/buscaTodos") // O paco AXIOS facilita o processo requisições HTTP
        .then( resposta => { // .then recebe o sucesso da requisição
            alteraLista(resposta.data) // altera a lista, adicionando os dados que vieram do banco na resposta
        })
        .catch( resposta => { // .catch recebe qualquer erro e problemas na requisição
            console.log(resposta) // podemos visualizar o erro no console caso aconteça
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
