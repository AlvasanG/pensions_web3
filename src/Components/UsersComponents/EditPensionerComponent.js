import React from "react";
import pensionSystemAbi from '../../pensionSystemAbi.json';
import { ethers } from "ethers";
import { useState } from 'react';
import '../../App.css';
import config from "../../config.json";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
const pensionSystemAddress = config.PENSION_SYSTEM_ADDRESS;

function EditPensionerComponent() {

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

    // Actualiza la fecha de jubilación de un usuario
    async function updateRetireDate() {
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
                const responseRetire = await contract.setRetirementTime(retireUnixDate);
            } catch (error) {
                let errorCode = error.code;
                let errorMsg = error.message;
                alert(errorCode + " --- " + errorMsg);
            }
        }
    }

    // Actualiza la duración de los beneficios de un usuario
    async function updateDuration() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                pensionSystemAddress,
                pensionSystemAbi.abi,
                signer
            );
            try {
                const benefitDurationSecs = benefitDuration * units[unitsIndex][0];
                const responseDuration = await contract.setBenefitDuration(benefitDurationSecs);
            } catch (error) {
                let errorCode = error.code;
                let errorMsg = error.message;
                alert(errorCode + " --- " + errorMsg);
            }
        }
    }

    // Actualiza la fecha de jubilación de un usuario a ahora
    async function updateRetireDateToNow() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                pensionSystemAddress,
                pensionSystemAbi.abi,
                signer
            );
            try {
                const responseRetire = await contract.setRetirementTimeNow();
            } catch (error) {
                let errorCode = error.code;
                let errorMsg = error.message;
                alert(errorCode + " --- " + errorMsg);
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
                <h1>Modificar información del pensionista</h1>
            </div>
            <div className="col-lg-6 col-sm-12">
                <h4>Fecha de retiro</h4>
                <Calendar onChange={onRetireDateChange} value={retireDate} />
                <div className="mt-3">
                    <button className="btn btn-primary mx-2" onClick={() => updateRetireDate()}>Actualizar fecha retiro</button>
                    <button className="btn btn-danger" onClick={() => updateRetireDateToNow()}>Retirar ahora</button>
                </div>
            </div>
            <div className="col-lg-6 col-sm-12">
                <h4>Duración beneficios</h4>
                <div className="row">
                    <div className="col">
                        <label className="form-label" htmlFor="durationInput">Duración</label>
                        <input className="form-control" id="durationInput" type="number" min="0" value={benefitDuration} onChange={handleBenefitDurationChange} />
                        <button className="btn btn-primary mt-3" onClick={() => updateDuration()}>Actualizar duración</button>
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
        </div >
    );
}

export default EditPensionerComponent;