import React from 'react';
import {useEffect} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Header, Navbar} from './compound/common';
import Home from './components/Home';
import Marketplace from "./components/Marketplace";
import SignIn from './components/SignIn';
import Asset from "./components/Asset";
import Create from './components/Create';
import DefiLink from "./components/DefiLink";
import User from "./components/User";
import Donate from './components/Donate';
import Sell from "./components/Sell"
import Progress_bar from "./components/Progress_bar"
import './App.css';

import {getCookie, saveUserInfo, checkChain, NETWORK, NETWORK_ID} from "./constants.js";

function App(){
  
  /**
   * Saves the user's information in a cookie that persists througout the entire website.
   *
   * @param userInfo The user's information in a javascript object. This will be 
   * stringified and be saved in a cookie.
   *
   * The userInfo object should be formatted as so:
   * {
   *   walletAddress, // must be non-empty, otherwise the cookie is deleted.
   * }
   *
   * Information should now be assessible via the getCookie function in
   * ./constants via getCookie("uid");
   *
   * note: the value of the cookie should be parsed as a JSON object
   */
  function saveUserInfo(userInfo){

    let userString = JSON.stringify(userInfo);
    // cookie expires in 24hr
    let expiryDate = new Date();
    expiryDate.setDate(new Date().getDate() + 1);

    document.cookie = `uid=${userString}; expires=${expiryDate}; SameSite=Lax; path=/`;

    // console.log(JSON.parse(getCookie("uid"))); // DEBUG
  }

  /**
   * Prompts the user to switch their connected chain if they are currently
   * connected to the incorrect chain for the website.
   *
   * This function will display a prompt with a button to ask Metamask to
   * switch networks.
   */
  function promptChainWarning(chain){
    if(!window.ethereum) return;
    chain = chain || window.ethereum.networkVersion;
    if(checkChain(chain)) return;

    alert(`you need to connect to the ${NETWORK.toUpperCase()} network to use this site`);
  }

  /**
   * Adds a wallet listener to check whenever the chain id the user is connected
   * to changes.
   */
  function addChainListener(){
    if(!window.ethereum) return;
    window.ethereum.on("chainChanged", (chain) => {
      console.log(chain);
      promptChainWarning(Number(chain));
    });
  }

  /**
   * Adds a wallet listener to check whenever the wallet address in the page 
   * changes, this includes switching wallets or disconnecting wallets
   */
  function addWalletListener(){
    if(window.ethereum){
      window.ethereum.on("accountsChanged", (accounts) => {
        if(accounts.length > 0 && window.localStorage.getItem("logged-in") !== null){
          saveUserInfo({walletAddress: accounts[0]});
          return;
        }

        saveUserInfo({walletAddress: ""});
      });
    }
  }

  /**
   * Gets the current wallet that is connected to the site, if there is one.
   */
  async function getCurrentWalletConnected(){
    if(window.ethereum){
      try{
        const addressArray = await window.ethereum.request({
          method: "eth_accounts"
        });
        if(addressArray.length > 0 && window.localStorage.getItem("logged-in") !== null){
          saveUserInfo({walletAddress: addressArray[0]});
          return;
        }

        saveUserInfo({walletAddress: ""});
      }catch(err){
        saveUserInfo({walletAddress: ""});
        console.error("something went wrong fetching current wallet", err.message);
      }
    }
  }

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
    promptChainWarning();
    addChainListener();
  }, []);

  // document.body.style = 'background: var(--main-background-colour);'; 
  // CHANGE BACKGROUND COLOR OF WHOLE PAGE

   return (
    
    <div className = "App">
      <Router>
      <Header />
        <div>
          <ul className="LinkList">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/marketplace">Marketplace</Link>
            </li>
            <li>
              <Link to='/signin'>Sign In</Link>
            </li>
            <li>
              <Link to="/asset">Asset</Link>
            </li>
            <li>
              <Link to='/Create'>Create New Item</Link>
            </li>
            <li>
              <Link to="/user">User</Link>
            </li>
            <li>
              <Link to='/Donate'>Donate Here!</Link>
            </li>
            <li>
              <Link to="/Sell">Sell</Link>
            </li>
            <li>
              <Link to="/Progress_bar">Progress_bar</Link>
            </li>
          </ul>
          <Route exact path="/" component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/signin" component={SignIn}/>
          <Route path="/asset/*" component={Asset} />
          <Route path="/create" component={Create}/>
          <Route path="/defi" component={DefiLink}/>
          <Route path="/user*" component={User} />
          <Route path="/donate/*" component={Donate}/>
          <Route path="/sell/*" component={Sell} />
          <Route path="/Progress_bar" component={Progress_bar} />
        </div>
        <div className={"chainWarning hidden"}>
          <p>
            You're currently connected to the incorrect chain.
            Please click <a href="#">here</a> to update your chain.
          </p>
        </div>
      </Router>
    </div>
  );
} 

// next line is very temporary
/*
class Home extends React.Component{
  render(){
    return(
      <div>
        <h2>home</h2>
      </div>
    );
  }
}
*/

export default App;
