import React, { useContext, useState, useEffect } from "react";
import { AccountsContext } from "../../App";
import { ethers } from "ethers";
import config from "../../config.json";
import pensionerAbi from '../../pensionerAbi.json';
import pensionSystemAbi from '../../pensionSystemAbi.json';

const pensionSystemAddress = config.PENSION_SYSTEM_ADDRESS;

function UserProfileComponent() {
    const context = useContext(AccountsContext);
    const accounts = context[0];

    const [userInfo, setUserInfo] = useState();

    const units = [
        [1, "segundo(s)"],
        [60, "minuto(s)"],
        [60 * 60, "hora(s)"],
        [60 * 60 * 24, "día(s)"]
    ];

    useEffect(() => {
        async function fetchData() {
            await fetchUserData();
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accounts])

    // Recupera la informacion de la primera cuenta del usuario
    async function fetchUserData() {
        if (window.ethereum && accounts.length > 0) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                pensionSystemAddress,
                pensionSystemAbi.abi,
                signer
            );
            try {
                const response = await contract.pensioners(accounts[0]);
                const emptyUser = /^0x0+$/.test(response);
                if (emptyUser) {
                    return;
                }
                var pensionerInfo = await buildPensionerFromAddress(response);
                let pensionerObj = {
                    "address": response,
                    "benefitDuration": pensionerInfo[0],
                    "finishPensionDate": pensionerInfo[1],
                    "isPensionerRetired": pensionerInfo[2],
                    "retireAtDate": pensionerInfo[3],
                    "createdAtTime": pensionerInfo[4],
                    "totalContributedAmount": pensionerInfo[5],
                };
                setUserInfo(pensionerObj);
            } catch (error) {
                let errorCode = error.code;
                let errorMsg = error.message;
                alert(errorCode + " --- " + errorMsg);
            }
        }
    }

    // Recupera la información de un usuario dado una dirección
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
            let errorCode = error.code;
            let errorMsg = error.message;
            alert(errorCode + " --- " + errorMsg);
        }
    }

    // Busca la mejor unidad para mostrar el tiempo
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
                <h1>Perfil del usuario</h1>
            </div>
            {userInfo === undefined
                ? <h4>El usuario no está registrado</h4>
                : <div>
                    <h2>Dirección: {userInfo.address}</h2>
                    <h3>Contribuciones totales: {userInfo.totalContributedAmount} wei</h3>
                    <h3>Fecha creación: {userInfo.createdAtTime.toLocaleString()}</h3>
                    <h3>Duración beneficios: {getDisplayTime(userInfo.benefitDuration)}</h3>
                    <h3>Fecha fin pensión: {userInfo.finishPensionDate.toLocaleString()}</h3>
                    <h3>Retirado: {userInfo.isPensionerRetired ? "Sí" : "No"}</h3>
                    <h3>Fecha jubilación: {userInfo.retireAtDate.toLocaleString()}</h3>
                </div>}
            <button className="btn btn-primary btn-lg" onClick={async () => await fetchUserData()}>Actualizar</button>
        </div>
    );
}

export default UserProfileComponent;