/**
 * @Stuart (person who created the file), (other people who developed this file)
 *
 * @version 2021.06.28.0 - added some CSS styles, functions are more fleshed out
 * 2021.06.22.1 - adding the names of necessary functions
 * 2021.06.22.0 - file created
 * 
 * @since 2021.06.22.0
 */
   

import React from "react";
import "./index.css"
import { useEffect, useState } from "react";
import {
	//oursmartcontract
	connectWallet,
	updateMessage,
	getCurrentWalletConnected,
} from "./interact.js";

const SignIn = () => { // Change the name after
    //state variables
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");

    /*
    This is a React hook that is called after your compoent is rendered.
    Because it has an empty array [] prop passed into it, it will only
    be called on the component's first render.
    */
    useEffect(() => {
      /*
      const message = await loadCurrentMessage();
      setMessage(message);
      addSmartContractListener();
      //*/

      async function temp(){
        const { address, status } = await getCurrentWalletConnected();
        setWallet(address)
        setStatus(status);
      }

      temp();

      addWalletListener();
    }, []);

    /*
    This function sets up a listener that detects changes in the user's Metamask
    wallet state, such as when the user disconnects their wallet or switch addresses
    */
    function addWalletListener() {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setWallet(accounts[0]);
            setStatus("Write a message in the text-field above.");
          } else {
            setWallet("");
            setStatus("Connect to Metamask using the top right button.");
          }
        });
      } else {
        setStatus(
          <p>
            {" "}🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask in your browser.
            </a>
          </p>
        );
      }
    }

    /*
    This function will be called to connect the user's Metamask wallet to frontend
    */
    const connectWalletPressed = async () => {
      const walletResponse = await connectWallet();
      setStatus(walletResponse.status);
      setWallet(walletResponse.address);
    };

  

    // The UI of the sign-in page
    return (
      <div className="wholeThing">
      <main id="main">
        <h2 className="sign-in-message" id="sign-in-message">
          Sign in to your wallet
        </h2>

      <div className="wallet-page">
        <div id="img-div" className="img-div">
          <img src="https://cdn.worldvectorlogo.com/logos/metamask.svg" id="metamask-img" alt="Your very own NFT Wallet" className="metamask-img">
          </img>
        </div>

      <button id="walletButton" onClick={connectWalletPressed}>
      {walletAddress.length > 0 ? (
				"Connected: " + String(walletAddress).substring(0, 6) + "..." +
				String(walletAddress).substring(38)) : (
				<span>Connect Wallet</span>
			)}
		</button>
    
        <h3 className="metamaskQuestion">
          <a href="https://docs.metamask.io/guide" target="_blank">
            What is MetaMask?
          </a> 
        </h3> 
      </div>
      </main>
      </div>
      )
  };

 
export default SignIn;
