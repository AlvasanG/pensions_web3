import React from "react";
import pensionSystemAbi from '../../pensionSystemAbi.json';
import { ethers } from "ethers";
import '../../App.css';
import config from "../../config.json";

const pensionSystemAddress = config.PENSION_SYSTEM_ADDRESS;

function CalculateStateComponent() {

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
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="info-display">
            <h4>Realizar el reparto de las pensiones</h4>
            <button onClick={() => calculateState()}>Repartir</button>
        </div>
    );
}

export default CalculateStateComponent;