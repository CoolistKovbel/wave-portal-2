import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { WagmiConfig, createClient } from 'wagmi'

import Profile from './components/Profile'

const client = createClient()

function App() {
  const [currentAccount, setCurrentAccount] = useState("")

  const checkIfWalletIsConnected = async () => {
    try{
      const { ethereum } = window;

    if (!ethereum){
      console.log("Wallet not connected")
    } else {
      console.log("Wallet connected", ethereum)
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
    }
  } catch (error){
    console.log(error)
  }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  })



  return (
    <WagmiConfig client={client}>
      <Profile />
      <div>
        <h2>Account: {currentAccount}</h2>
        <button onClick={connectWallet}>Connect</button>
      </div>
    </WagmiConfig>
  )
}

export default App;