import axios from "axios";
import { useEffect, useState } from "react"

export default function Listagem( {lista} ){

    return(
        <div>
            <h2> Listagem </h2>
            <ul>
                {
                    lista == 0 ?
                        <p> Carregando... </p>
                    :
                        lista.map( item => {
                            return (
                                <p key={item.id} > <strong>{ item.id }</strong> - { item.texto } </p> 
                            )
                        })
                }   
            </ul>
        </div>
    )
}