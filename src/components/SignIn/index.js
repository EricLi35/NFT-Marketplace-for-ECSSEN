/**
 * @Stuart (person who created the file), (other people who developed this file)
 *
 * @version 2021.06.28.0 - added some CSS styles, functions are more fleshed out
 * 2021.06.22.1 - adding the names of necessary functions
 * 2021.06.22.0 - file created
 * 
 * @since 2021.06.22.0
 */
   
import { string } from "prop-types";
import React from "react";
import "./index.css"
import { useEffect, useState } from "react";
import {Redirect} from "react-router";
import {
	//oursmartcontract
	connectWallet,
	updateMessage,
	loadCurrentMessage,
	getCurrentWalletConnected,
} from "./interact.js";
import {saveUserInfo} from "../../constants";

const SignIn = () => { // Change the name after
    //state variables
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("No connection to the network."); //default message
    const [newMessage, setNewMessage] = useState("");

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
    This function sets up a listener that will watch for the smart contract's
    updateMessages event and update the UI when the information is chaaned in 
    the smart contract
    */
    function addSmartContractListener() {
      /*
      ourSmartContract.events.updatedMessages({}, (error, data) => {
        if (error){
          setStatus("😥 " + error.message)
        } else {
          setMessage(data.returnValues[i]);
          setNewMessage("");
          setStatus(" Your message has been updated!");
        }
      });
      */
    }

    /*
    This function sets up a listener that detects changes in the user's Metamask
    wallet state, such as when the user disconnects their wallet or switch addresses
    */
    function addWalletListener() {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setWallet(accounts[0] && window.localStorage.getItem("logged-in") !== null);
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
      window.localStorage.setItem("logged-in", true);
      const walletResponse = await connectWallet();
      setStatus(walletResponse.status);
      setWallet(walletResponse.address.trim());
      saveUserInfo({walletAddress: walletResponse.address});
    };

    /*
    This function will be called when the user wants to update the message stored
    in the smart contract
    */
    const onUpdatePressed = async () => {
      const { status } = await updateMessage(walletAddress, newMessage);
      setStatus(status);
    };

    function redirectRefresh(){
      let path = window.localStorage.getItem("assetLook")
        ? `/asset/${window.localStorage.getItem("assetLook")}`
        : "/user";

      window.history.pushState({}, "", path);
      window.location.reload(false);
    }

    // The UI of the sign-in page
    return (
      <div className="wholeThing">
      {
        walletAddress === ""
        ? <></>
        : redirectRefresh()
      }
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
    
        {/* Took this out because we're just using metamask as the wallet right now
        <div id="different-wallet" className="different-wallet">
          <button className="wallet-dropdown"> → USE A DIFFERENT WALLET</button>
          <div className="wallet-options" //should be a dropdown menu>
           <a href="#">Option 1</a>
           <a href="#">Option 2</a>
           <a href="#">Option 3</a>
        </div>       
        </div>
        */}

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
