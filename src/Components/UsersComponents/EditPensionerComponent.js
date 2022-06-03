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
    const [benefitDuration, setBenefitDuration] = useState(0);
    const [unitsIndex, setUnitsIndex] = useState("1");

    const units = [
        [1, 0, "second(s)"],
        [60, 1, "minute(s)"],
        [60 * 60, 2, "hour(s)"],
        [60 * 60 * 24, 3, "day(s)"],
        [30 * 60 * 60 * 24, 4, "month(s) - 30 days"]
    ];

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
                console.log(responseRetire);
            } catch (error) {
                console.log(error);
            }
        }
    }

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
                console.log(responseDuration);
            } catch (error) {
                console.log(error);
            }
        }
    }

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
                console.log(responseRetire);
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
        <div className="info-display">
            Fecha retiro:
            <Calendar onChange={onRetireDateChange} value={retireDate} />
            <div>
                <button onClick={() => updateRetireDate()}>Actualizar fecha retiro</button>
                <button className="btn-danger" onClick={() => updateRetireDateToNow()}>Retirar ahora</button>
            </div>
            Duración beneficios:
            <form>
                <input type="number" min="0" value={benefitDuration} onChange={handleBenefitDurationChange} />
                <select id="duration_units" name="Units" value={unitsIndex} onChange={handleUnitsChange}>
                    {units.map(item => {
                        return <option key={item[1].toString()} value={item[1]}>{item[2]}</option>
                    })}
                </select>
            </form>
            <div>
                <button onClick={() => updateDuration()}>Actualizar duración</button>
            </div>
        </div>
    );
}

export default EditPensionerComponent;