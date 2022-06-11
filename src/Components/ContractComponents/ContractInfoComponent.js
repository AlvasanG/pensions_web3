import React, { useEffect, useState } from "react";
import pensionSystemAbi from '../../pensionSystemAbi.json';
import { ethers } from "ethers";
import '../../App.css';
import config from "../../config.json";

const pensionSystemAddress = config.PENSION_SYSTEM_ADDRESS;

function ContractInfoComponent() {

    const [contractBalance, setBalance] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);
    const [block, setBlock] = useState(0);
    const [creationDate, setCreationDate] = useState();
    const [payoutInterval, setPayoutInterval] = useState(0);
    const [lastPayoutDate, setLastPayoutDate] = useState();

    const units = [
        [1, "segundo(s)"],
        [60, "minuto(s)"],
        [60 * 60, "hora(s)"],
        [60 * 60 * 24, "día(s)"]
    ];

    useEffect(() => {
        async function fetchData() {
            await fetchContractData();
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pensionSystemAddress])


    // Recupera la informacion del contrato
    async function fetchContractData() {
        await getContractInfo();
        await getPensionSystemInfo();
    }

    // Recupera la informacion relativa al contrato y la cadena de bloques
    async function getContractInfo() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            try {
                const responseBalance = await provider.getBalance(pensionSystemAddress);
                const responseTx = await provider.getTransactionCount(pensionSystemAddress);
                const lastBlock = await provider.getBlockNumber();
                const responseBlock = await provider.getBlock(lastBlock);
                setBlock(responseBlock);
                setTransactionCount(responseTx);
                try {
                    setBalance(responseBalance.toNumber());
                } catch (error) {
                    setBalance(responseBalance.toString());
                }
            } catch (error) {
                let errorCode = error.code;
                let errorMsg = error.message;
                alert(errorCode + " --- " + errorMsg);
            }
        }
    }

    // Recupera la informacion del sistema de pensiones
    async function getPensionSystemInfo() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                pensionSystemAddress,
                pensionSystemAbi.abi,
                signer
            );
            try {
                const responseCreationDate = await contract.createdAtTime();
                const responsePayoutInterval = await contract.payoutInterval();
                const responseLastPayout = await contract.lastPayoutDate();
                setCreationDate(new Date(responseCreationDate.toNumber() * 1000))
                setPayoutInterval(responsePayoutInterval.toNumber())
                setLastPayoutDate(new Date(responseLastPayout.toNumber() * 1000))
            } catch (error) {
                let errorCode = error.code;
                let errorMsg = error.message;
                alert(errorCode + " --- " + errorMsg);
            }
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
                <h1>Información del contrato</h1>
            </div>
            <h2>Dirección: {pensionSystemAddress}</h2>
            <h3>Saldo total: {contractBalance === undefined ? 0 : contractBalance} wei</h3>
            <h3>Nº transacciones: {transactionCount === undefined ? 0 : transactionCount}</h3>
            <h3>Nº bloque: {block === undefined ? "" : block["number"]}</h3>
            <h4>Fecha creación: {creationDate === undefined ? "" : creationDate.toLocaleString()}</h4>
            <h4>Intervalo reparto: {payoutInterval === undefined ? "0 second(s)" : getDisplayTime(payoutInterval)}</h4>
            <h4>Fecha último reparto: {lastPayoutDate === undefined ? "" : lastPayoutDate.toLocaleString()}</h4>
            <button className="btn btn-primary btn-lg" onClick={async () => await fetchContractData()}>Actualizar</button>
        </div>
    );
}

export default ContractInfoComponent;