import React from 'react';
import './App.css';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomeView from './Pages/HomeView';
import { ethers } from "ethers";
import { Navigation } from './Components/MainPage/NavigationComponent';
import ContractInfoComponent from './Components/ContractComponents/ContractInfoComponent';
import CalculateStateComponent from './Components/ContractComponents/CalculateStateComponent';
import UserListComponent from './Components/ContractComponents/UserListComponent';
import CreatePensionerComponent from './Components/UsersComponents/CreatePensionerComponent';
import FundPensionComponent from './Components/UsersComponents/FundPensionComponent';
import EditPensionerComponent from './Components/UsersComponents/EditPensionerComponent';
import UserProfileComponent from './Components/UsersComponents/UserProfileComponent';

export const AccountsContext = React.createContext();

function App() {
  // CONNECTING 
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState([]);

  // Recupera las cuentas conectadas desde MetaMask
  async function connectAccounts() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setAccounts(accounts);
    }
  }

  // Intenta recuperar las cuentas cuando inicia la aplicación
  useEffect(() => {
    async function fetchData() {
      await connectAccounts();
    }
    fetchData();
  }, []);

  // Cuando cambian las cuentas recupera el balance total de las cuentas
  useEffect(() => {
    async function retrieveBalances() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let accountsBalances = [];
        for (let i = 0; i < accounts.length; i++) {
          const bigNumBalance = await provider.getBalance(accounts[i]);
          try {
            accountsBalances[i] = bigNumBalance.toNumber();
          } catch (error) {
            accountsBalances[i] = bigNumBalance.toString();
          }
        }
        setBalances(accountsBalances);
      }
    }
    async function fetchData() {
      if (accounts.length > 0) {
        await retrieveBalances();
      }
    }
    fetchData();
  }, [accounts]);

  return (
    <AccountsContext.Provider value={[accounts, balances]}>
      <Router>
        <Navigation accounts={accounts} />
        <Routes>
          <Route path="/" exact element={<HomeView />} />
          {/* Rutas sobre el contrato */}
          <Route path="/contract/info" element={<ContractInfoComponent />} />
          <Route path="/contract/users" element={<UserListComponent />} />
          <Route path="/contract/calculate" element={<CalculateStateComponent />} />
          {/* Rutas sobre el usuario */}
          <Route path="/user/create" element={<CreatePensionerComponent />} />
          <Route path="/user/fund" element={<FundPensionComponent />} />
          <Route path="/user/edit" element={<EditPensionerComponent />} />
          <Route path="/user/profile" element={<UserProfileComponent />} />
        </Routes>
      </Router>
    </AccountsContext.Provider>
  );
}

export default App;