import { useState } from "react"
import axios from 'axios';

export default function Cadastro( {insere} ){

    const [ texto, alteraTexto ] = useState("");

    async function enviaFormulario( e ){
        e.preventDefault();

        const obj = {
            texto: texto,
            status: true
        }

        insere( obj )
        alteraTexto("")

    }

    return(
        <div>
            <h2> Cadastro </h2>

            <form onSubmit={enviaFormulario} >
                <label>
                    Insira um dado na lista
                    <br/>
                    <input required value={ texto } onChange={ e => alteraTexto( e.target.value ) } />
                </label>
                <button> Salvar </button>
            </form>

        </div>
    )
}