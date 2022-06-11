import React from "react";
import pensionSystemAbi from '../../pensionSystemAbi.json';
import { ethers, FixedNumber } from "ethers";
import { useState } from 'react';
import '../../App.css';
import config from "../../config.json";

const pensionSystemAddress = config.PENSION_SYSTEM_ADDRESS;

function FundPensionComponent() {
    const [fundAmount, setFundAmount] = useState(1);
    const [unitsIndex, setUnitsIndex] = useState("0");

    const units = [
        [1, 0, "ether(s)", 1]
    ];

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

    function handleUnitsChange(event) {
        setUnitsIndex(event.target.value);
    }

    return (
        <div className="info-display">
            <div className="mb-3">
                <h1>Contribuir a la pensión</h1>
            </div>
            <div className="col-lg-6 col-sm-12">
                <div className="row">
                    <div className="col">
                        <label className="form-label" htmlFor="inputCantidad">Cantidad</label>
                        <input className="form-control" id="inputCantidad" type="number" min="0" value={fundAmount} onChange={onAmountChange} />
                        <button className="btn btn-primary mt-3" onClick={() => handleContributions()}>Contribuir</button>
                    </div>
                    <div className="col">
                        <label className="form-label" htmlFor="durationUnits">Unidades</label>
                        <select id="durationUnits" className="form-select" name="Units" value={unitsIndex} onChange={handleUnitsChange}>
                            {units.map(item => {
                                return <option key={item[1].toString()} value={item[1]}>{item[2]}</option>
                            })}
                        </select>
                    </div>
                </div>
            </div >
        </div>
    );
}

export default FundPensionComponent;