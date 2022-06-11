import React from "react";
import pensionSystemAbi from '../../pensionSystemAbi.json';
import { ethers } from "ethers";
import '../../App.css';
import config from "../../config.json";

const pensionSystemAddress = config.PENSION_SYSTEM_ADDRESS;

function CalculateStateComponent() {

    // Llama a la función para hacer el reparto de las pensiones
    async function calculateState() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                pensionSystemAddress,
                pensionSystemAbi.abi,
                signer
            );
            try {
                const response = await contract.calculateState();
            } catch (error) {
                let errorCode = error.code;
                let errorMsg = error.message;
                alert(errorCode + " --- " + errorMsg);
            }
        }
    }

    return (
        <div className="info-display">
            <div className="mb-3">
                <h1>Realizar el reparto de las pensiones</h1>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => calculateState()}>Repartir</button>
        </div>
    );
}

export default CalculateStateComponent;