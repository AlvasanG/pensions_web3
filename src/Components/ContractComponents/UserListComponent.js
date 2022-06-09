import React, { useState } from "react";
import pensionSystemAbi from '../../pensionSystemAbi.json';
import pensionerAbi from '../../pensionerAbi.json';
import { ethers } from "ethers";
import '../../App.css';
import config from "../../config.json";

const pensionSystemAddress = config.PENSION_SYSTEM_ADDRESS;

function UserListComponent() {

    const [pensionerList, setPensionerList] = useState([]);

    const units = [
        [1, "segundo(s)"],
        [60, "minuto(s)"],
        [60 * 60, "hora(s)"],
        [60 * 60 * 24, "día(s)"]
    ];

    async function getPensionersList() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                pensionSystemAddress,
                pensionSystemAbi.abi,
                signer
            );
            try {
                const response = await contract.getPensionerList();
                var addresses = response[0];
                var pensioners = response[1];
                let _pensionerList = [];
                for (let i = 0; i < addresses.length; i++) {
                    var pensionerInfo = await buildPensionerFromAddress(pensioners[i]);
                    let pensionerObj = {
                        "address": addresses[i],
                        "pensioner": {
                            "address": pensioners[i],
                            "benefitDuration": pensionerInfo[0],
                            "finishPensionDate": pensionerInfo[1],
                            "isPensionerRetired": pensionerInfo[2],
                            "retireAtDate": pensionerInfo[3],
                            "createdAtTime": pensionerInfo[4],
                            "totalContributedAmount": pensionerInfo[5],
                        }
                    };
                    _pensionerList.push(pensionerObj);
                }
                setPensionerList(_pensionerList);
            } catch (error) {
                console.log(error);
            }
        }
    }

    async function buildPensionerFromAddress(pensionerAddress) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            pensionerAddress,
            pensionerAbi.abi,
            signer
        );
        try {
            let benefitDuration = await contract.benefitDuration();
            benefitDuration = benefitDuration.toNumber();
            let finishPensionDate = await contract.getFinishPensionTime();
            finishPensionDate = new Date(finishPensionDate.toNumber() * 1000);
            const isPensionerRetired = await contract.isPensionerRetired();
            let retireAtDate = await contract.retireAtDate();
            retireAtDate = new Date(retireAtDate.toNumber() * 1000);
            let createdAtTime = await contract.createdAtTime();
            createdAtTime = new Date(createdAtTime.toNumber() * 1000);
            let totalContributedAmount = await contract.totalContributedAmount();
            totalContributedAmount = totalContributedAmount.toString();
            return [benefitDuration, finishPensionDate, isPensionerRetired, retireAtDate, createdAtTime, totalContributedAmount];
        } catch (error) {
            console.log(error);
        }
    }

    function getDisplayTime(seconds) {
        let bestUnit = units[0];
        for (const unit of units) {
            if (seconds >= unit[0]) {
                bestUnit = unit;
            }
        }
        const [divisor, label] = bestUnit;
        return Math.floor(seconds / divisor) + " " + label;
    }

    return (
        <div className="info-display">
            <div className="mb-3">
                <h1>Listado de pensionistas</h1>
            </div>
            {pensionerList.length === 0
                ? <h4>No hay pensionistas</h4>
                : <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <caption>Listado de usuarios</caption>
                        <thead>
                            <tr>
                                <th>Dirección</th>
                                <th>Contribuciones totales (wei)</th>
                                <th>Fecha creación</th>
                                <th>Duración beneficios</th>
                                <th>Fecha fin pensión</th>
                                <th>Retirado</th>
                                <th>Fecha jubilación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pensionerList.map(item => {
                                return <tr key={item.pensioner.address}>
                                    <td>{item.address}</td>
                                    <td>{item.pensioner.totalContributedAmount}</td>
                                    <td>{item.pensioner.createdAtTime.toLocaleString()}</td>
                                    <td>{getDisplayTime(item.pensioner.benefitDuration)}</td>
                                    <td>{item.pensioner.finishPensionDate.toLocaleString()}</td>
                                    <td>{item.pensioner.isPensionerRetired ? "Sí" : "No"}</td>
                                    <td>{item.pensioner.retireAtDate.toLocaleString()}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>}
            <button className="btn btn-primary btn-lg" onClick={async () => await getPensionersList()}>Actualizar lista</button>
        </div>
    );
}

export default UserListComponent;