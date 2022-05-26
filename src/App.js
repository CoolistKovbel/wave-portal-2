import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { WagmiConfig, createClient } from 'wagmi'

import Profile from './components/Profile'

const client = createClient()

function App() {
  const [pAccount, setPAccount] = useState("")

  const getEthereumWallet = async () => {

    try {

      const {ethereum} = window

      if(ethereum) {
        console.log("There is an object ", ethereum)
      } else{
        console.log("There is no account")
      }

      const accounts = await ethereum.request({method: "eth_accounts"})
      if(accounts.length !== 0) {
        const account = accounts[0]
        console.log("Authorized account: ", account)
        setPAccount(account)
      }else{
        console.log("Not auth account")
      }


    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    getEthereumWallet()
  })



  return (
    <WagmiConfig client={client}>
      <Profile />
      <div>
        <h2>Account: {pAccount}</h2>
      </div>
    </WagmiConfig>
  )
}

export default App;