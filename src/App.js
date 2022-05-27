import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/wave.json"
import Header from "./components/Header";
import Bio from "./components/Bio";
import Status from "./components/Status";

export default function App() {

  // Variable where we can store our account
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaveCount, setTotalWaveCount] = useState('')
  const [allWaves, setAllWaves] = useState([]);
  const [singleUserWaves, setSingleUserWaves] = useState(0)
  const [personalMessage, setPersonalMessage] = useState('')
  const [miningTimer, setMiningTimer] = useState(false)

  const contractAddress = "0x22A45558582cd3d7a27fD7a2c05E6DC48E164FeB"
  const contractAbi = abi.abi;

  // Gets the provider and the signers
  const getEthereum = () => {
    const {ethereum} = window
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress,contractAbi,signer);

    return wavePortalContract

  }

  // Check if wallet is connected
  const checkIfWalletIsConnect = async () => {

    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }

      // Gets SmartContract and sets the total number of waves in the contract
      const wavePortalContract = getEthereum();

      let count = await wavePortalContract.getTotalWaves();
      setTotalWaveCount(count.toNumber());

      await getAllWaveResultFromSingleUser(accounts[0])
      await getAllWaves()



    } catch (error) {
      console.log(error);
    }

  }

  /**
  * Implement your connectWallet method here
  */
   const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      // Connects  Accounts
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Gets SmartContract and sets the total number of waves in the contract
      const wavePortalContract = getEthereum();

      let count = await wavePortalContract.getTotalWaves();
      setTotalWaveCount(count.toNumber());

      await getAllWaves()
      await getAllWaveResultFromSingleUser(accounts[0])

    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const {ethereum} = window

      if(!ethereum) {
        console.log("You need metamask")
      }else{

        const wavePortalContract = getEthereum()

        let count = await wavePortalContract.getTotalWaves();

        const waveTx = await wavePortalContract.wave(personalMessage, {gasLimit: 300000});
        console.log("mining trx: ", waveTx.hash)
        setMiningTimer(true)

        await waveTx.wait()
        console.log("Mined -- ", waveTx.hash)
        setMiningTimer(false)

        count = await wavePortalContract.getTotalWaves()
        console.log("Total count: ", count.toNumber())
        setTotalWaveCount(count.toNumber());

        await getAllWaves()
        await getAllWaveResultFromSingleUser(currentAccount)
        setPersonalMessage('')

      }

    } catch (err) {
      console.log(err)
    }
  }

  const getAllWaves = async () => {

    try {
      const {ethereum} = window
      if(ethereum) {
        const wavePortalContract = getEthereum()

        // Calls the web provider
        const waves = await wavePortalContract.getAllWaves()

        let wavesCleaned = []
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          })
        })

        // Data Stored in React
        setAllWaves(wavesCleaned)

      }else{
        console.log("Ethereum no exist")
      }

    } catch (error) {
      console.log(error)
    }


  }

  const getAllWaveResultFromSingleUser = async (_account) => {
    try {
      const {ethereum} = window
      if(ethereum){

        const wavePortalContract = getEthereum()

        // Call the wave amount giving the address of the signer
        const amountOfWaves = await wavePortalContract.userStatus(_account)

        console.log(wavePortalContract)

        setSingleUserWaves(amountOfWaves.toNumber())

      }else{
        alert("You need metamask")
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (x) => {
    console.log(x)
    setPersonalMessage(x)
  }

  useEffect( () => {
    checkIfWalletIsConnect();
  }, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <Header />

        <Bio
          isAccount={currentAccount}
          waveButton={wave}
          deMessage={personalMessage}
          handleChange={handleChange}
          isProgress={miningTimer}
          />

        {!currentAccount && (
          <button className="connectButton" onClick={connectWallet}>
            Connect
          </button>
        )}

        {/* Loading section */}

        {currentAccount && (
          <Status
            isAccount={currentAccount}
            waveCount={totalWaveCount}
            singleWaveCount={singleUserWaves}
            deWaves={allWaves}
            />
        )}

      </div>

    </div>
  );
}
