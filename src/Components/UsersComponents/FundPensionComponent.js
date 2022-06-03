import React from "react";
import pensionSystemAbi from '../../pensionSystemAbi.json';
import { ethers, FixedNumber } from "ethers";
import { useState } from 'react';
import '../../App.css';
import config from "../../config.json";

const pensionSystemAddress = config.PENSION_SYSTEM_ADDRESS;

function FundPensionComponent() {
    const [fundAmount, setFundAmount] = useState(0.0005);

    const onAmountChange = e => {
        setFundAmount(e.target.value);
    }

    async function handleContributions() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                pensionSystemAddress,
                pensionSystemAbi.abi,
                signer
            );
            try {
                const bigNumberAmount = FixedNumber.fromString(fundAmount.toString());
                let options = {
                    value: bigNumberAmount,
                    gasLimit: 3000000,
                    gasPrice: 1500
                };
                const response = await contract.fundPension(options);
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="bordered">
            <form>
                <label>
                    Cantidad (ether):
                    <input type="text" value={fundAmount} onChange={onAmountChange} />
                </label>
            </form>
            <button onClick={() => handleContributions()}>Contribuir</button>
        </div>
    );
}

export default FundPensionComponent;