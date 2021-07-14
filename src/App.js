import React from 'react';
import {useEffect} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Header, Navbar} from './compound/common';
import Home from './components/Home';
import Marketplace from "./components/Marketplace";
import SignIn from './components/SignIn';
import Asset from "./components/Asset";
import Create from './components/Create';
import User from "./components/User";
import Donate from './components/Donate';
import Sell from "./components/Sell"
import Progress_bar from "./components/Progress_bar"
import './App.css';

import {getCookie} from "./constants.js";

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

    document.cookie = `uid=${userString}; expires=${expiryDate}; SameSite=Lax;`;

    // console.log(JSON.parse(getCookie("uid"))); // DEBUG
  }

  /**
   * Adds a wallet listener to check whenever the wallet address in the page 
   * changes, this includes switching wallets or disconnecting wallets
   */
  function addWalletListener(){
    if(window.ethereum){
      window.ethereum.on("accountsChanged", (accounts) => {
        if(accounts.length > 0){
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
        if(addressArray.length > 0){
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
  });

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
          <Route path="/asset" component={Asset} />
          <Route path="/create" component={Create}/>
          <Route path="/user" component={User} />
          <Route path="/donate" component={Donate}/>
          <Route path="/sell" component={Sell} />
          <Route path="/Progress_bar" component={Progress_bar} />
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
