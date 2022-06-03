import React from "react";
import '../App.css';
import 'react-calendar/dist/Calendar.css';

export default function HomeView() {

    return (
        <div className="App">
            <h1>Pantalla principal de la aplicación</h1>
            <div className="row px-3">
                <div className="col-sm-12 col-md-4 py-3 d-flex align-items-stretch">
                    <div className="card">
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title"><u>Repositorio Contrato</u></h5>
                            <p className="card-text mb-4">Aquí podemos consultar el repositorio donde está alojado el código del contrato inteligente
                                sobre el cual trabaja esta aplicación.</p>
                            <a href="https://github.com/AlvasanG/PensionsTFG" className="btn btn-primary mt-auto">Github</a>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-md-4 py-3 d-flex align-items-stretch">
                    <div className="card">
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title"><u>Ethereum</u></h5>
                            <p className="card-text mb-4">La cadena de bloques sobre la que hemos construido nuestro contrato inteligente y la moneda
                                que utilizamos para operar con el contrato y la cadena de bloques.</p>
                            <a href="https://ethereum.org/es/" className="btn btn-primary mt-auto">Página Web</a>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-md-4 py-3 d-flex align-items-stretch">
                    <div className="card">
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title"><u>Solidity</u></h5>
                            <p className="card-text mb-4">El lenguaje de programación utilizado para desarrollar contratos inteligentes en la cadena
                                de bloques de ethereum. Nuestros bloques para construir aplicaciones que interaccionan con la cadena de bloques.</p>
                            <a href="https://soliditylang.org/" className="btn btn-primary mt-auto">Página Web</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}