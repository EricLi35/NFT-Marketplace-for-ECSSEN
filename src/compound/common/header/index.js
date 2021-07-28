import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as LoginIcon } from './login.svg';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import { House, ShopWindow, Coin, PersonCircle } from "react-bootstrap-icons";
import { getCookie } from "../../../constants";
/* import Marketplace from "./../../../components/Marketplace";
import Home from '../../../components/Home';
import SignIn from '../../../components/SignIn';
import User from "../../../components/User"; */
import './bcharity_logo.png';
import './Header.css';

function Header(){
    const [userWallet, setUserWallet] = useState("");

    /*
    This function sets up a listener that detects changes in the user's Metamask
    wallet state, such as when the user disconnects their wallet or switch addresses
    */
    function addWalletListener() {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0 && window.localStorage.getItem("logged-in") !== null){
            setUserWallet(accounts[0]);
          } else {
            setUserWallet("");
          }
        });
      }
    }

    const updateNavbar = async (evt) => {
        let focusElement = evt.target;
        let counter = 0;
        while(focusElement.href === undefined && counter < 5){
          focusElement = focusElement.parentElement;
          counter++;
        }

        console.log(focusElement);
        let activeElement = document.querySelector(".navbar-active")
        if(activeElement !== null) activeElement.classList.remove("navbar-active");
        document.querySelectorAll(".navbar-item").forEach((item) => {
            if(item.firstChild.href !== focusElement.href){
                return;
            }
            item.classList.add("navbar-active");
        });
    }

    function setCurrent(){
      let currentPath = window.location.toLocaleString();
      if(currentPath === `${window.location.origin}/`) currentPath += "home";

      document.querySelectorAll(".navbar-item").forEach((item) => {
        console.log(currentPath, item.firstChild.href);
        if(item.firstChild.href.toUpperCase() !== currentPath.toUpperCase()) return;
        item.classList.add("navbar-active");
      });
    }

    useEffect(() => {
      setCurrent();
      addWalletListener();

      // Check for current wallet if connected
      if(window.localStorage.getItem("logged-in") === null) return;
      let userJson = getCookie("uid");
      if(userJson === undefined){
        return;
      }

      let userData = JSON.parse(userJson);
      setUserWallet(userData.walletAddress);
    },[])

    function showLoginButton(){
      return(
        <Link to="/signin" className="signInLink">
          <button className="userHeaderButton">
            <PersonCircle />
            <p className="signInText">
              Connect
            </p>
          </button>
        </Link>
      )
    }

    function showUserButton(){
      let walletShorten = `${userWallet.substring(0,4)}...${userWallet.substring(39, 42)}`;
      return(
        <div>
          <Login_item>
            <button className="userHeaderButton">
              <PersonCircle />
              <p className="signInText">
                {walletShorten}
              </p>
            </button>
          </Login_item>
        </div>
      )
    }

   function Login(props) {
      return (
          <div className="login-section">
              <ul className="login-div">{ props.children }</ul>
          </div>
      );
  }

  function Login_item(props){

      const [open, setOpen] = useState(false);

      return (
          <li className="login-item">
              <a className="icon-button" onClick={() => setOpen(!open)}>
                  {props.children}
              </a>
              {open && DropdownMenu()}
          </li>
      )
  }

  function DropdownMenu(){

      function handleLogout(){
        document.cookie = "uid={\"walletAddress\":\"\"}; path=/"
        window.localStorage.removeItem("logged-in");
        setUserWallet("");
      }

      function DropdownItem(props){
          return (
              <a href="#" className="menu-item">
                  {props.children}
              </a>
          );
      }

    return (
        <div className="dropdown">
            <DropdownItem>
                <NavLink className="dropnav" as={Link} to={"/Signin"}>
                    <h3>
                    Sign In
                    </h3>
                </NavLink>
            </DropdownItem>

            <DropdownItem>
                <NavLink className="dropnav" as={Link} to={"/user"}>
                    <h3>
                    My NFTs
                    </h3>
                </NavLink>
            </DropdownItem>
            <DropdownItem>
            <NavLink className="dropnav" as={Link} to={"/home"} onClick={handleLogout}>
                    <h3>
                    Log Off
                    </h3>
                </NavLink>
            </DropdownItem>
        </div>
    )
}

    return (
        <section className = "navbar">

            <div className = "navbar_logo">
                <img src="./bcharity_logo.png"alt="bcharity_logo"></img>
                <p className="navbar_bcharity">
                    BCHARITY
                </p>
            </div>

            <div className = "navbar-item-container">
                <div 
                  className="navbar-item"
                  onClick={updateNavbar}
                >
                    <NavLink as={Link} to={"/home"} className="navlink-items">
                      <House />
                      <p className="navlink-text">
                        Home
                      </p>
                    </NavLink>
                </div>
                <div
                  className="navbar-item"
                  onClick={updateNavbar}
                >
                    <NavLink as={Link} to={"/marketplace"} className="navlink-items">
                      <ShopWindow />
                        <p className="navlink-text">
                          Marketplace
                        </p>
                    </NavLink>
                </div>
                <div className="navbar-item" onClick={updateNavbar}>
                  <NavLink as={Link} to={"/defi"} className="navlink-items">
                    <Coin />
                    <p className="navlink-text">
                      DeFi
                    </p>
                  </NavLink>
                </div>
             </div>
            {/*
             <div className="navbar_search">
                 <label className="searchLabel">
                 <input className="searchBar" type="text" placeholder="Search..." />
                 </label>
             </div>
             */}
             <Login>
              {
                userWallet === ""
                  ? showLoginButton()
                  : showUserButton()
              }
             </Login>
        </section>
    )
 }  


export default Header;

