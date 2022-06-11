import React from "react";
import pensionSystemAbi from '../../pensionSystemAbi.json';
import { ethers } from "ethers";
import { useState } from 'react';
import '../../App.css';
import config from "../../config.json";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const pensionSystemAddress = config.PENSION_SYSTEM_ADDRESS;

function CreatePensionerComponent() {

    const [retireDate, onRetireDateChange] = useState(new Date());
    const [benefitDuration, setBenefitDuration] = useState(1);
    const [unitsIndex, setUnitsIndex] = useState("2");

    const units = [
        [1, 0, "segundo(s)"],
        [60, 1, "minuto(s)"],
        [60 * 60, 2, "hora(s)"],
        [60 * 60 * 24, 3, "día(s)"],
        [30 * 60 * 60 * 24, 4, "mes(es) - 30 días"]
    ];

    async function createPensioner() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                pensionSystemAddress,
                pensionSystemAbi.abi,
                signer
            );
            try {
                const retireUnixDate = Math.floor(retireDate.getTime() / 1000);
                const benefitDurationSecs = benefitDuration * units[unitsIndex][0];
                const response = await contract.createPensioner(retireUnixDate, benefitDurationSecs);
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }
    }

    function handleBenefitDurationChange(event) {
        if (event.target.value === '') {
            setBenefitDuration(0);
        } else {
            setBenefitDuration(event.target.valueAsNumber);
        }
    }

    function handleUnitsChange(event) {
        setUnitsIndex(event.target.value);
    }

    return (
        <div className="info-display row">
            <div className="mb-3">
                <h1>Crear pensionista</h1>
            </div>
            <div className="col-lg-6 col-sm-12">
                <h4>Fecha de retiro</h4>
                <Calendar onChange={onRetireDateChange} value={retireDate} />
            </div>
            <div className="col-lg-6 col-sm-12">
                <h4>Duración beneficios</h4>
                <div className="row">
                    <div className="col">
                        <label className="form-label" htmlFor="durationInput">Duración</label>
                        <input className="form-control" id="durationInput" type="number" min="0" value={benefitDuration} onChange={handleBenefitDurationChange} />
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
            <div className="col-12 text-center">
                <button className="bnt btn-primary btn-lg" onClick={() => createPensioner()}>Crear pensionista</button>
            </div>
        </div >
    );
}

export default CreatePensionerComponent;