import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as LoginIcon } from './login.svg';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import { House, ShopWindow, Coin } from "react-bootstrap-icons";
/* import Marketplace from "./../../../components/Marketplace";
import Home from '../../../components/Home';
import SignIn from '../../../components/SignIn';
import User from "../../../components/User"; */
import './bcharity_logo.png';
import './Header.css';

function Header(){
    const updateNavbar = async (evt) => {
        console.log(evt.target.innerText);
        let activeElement = document.querySelector(".navbar-active")
        if(activeElement !== null) activeElement.classList.remove("navbar-active");
        document.querySelectorAll(".navbar-item").forEach((item) => {
            if(item.innerText !== evt.target.innerText){
                return;
            }
            item.classList.add("navbar-active");
        });
    }

    function setCurrent(){
      let currentPath = window.location.pathname.substring(1);
      if(currentPath === "") currentPath = "home";

      document.querySelectorAll(".navbar-item").forEach((item) => {
        if(item.innerText.toUpperCase() !== currentPath.toUpperCase()) return;
        item.classList.add("navbar-active");
      });
    }

    useEffect(() => {
      setCurrent();
    },[])

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
                 <Login_item icon={<LoginIcon />}>
                 </Login_item>
             </Login>
        </section>
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
            <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
                {props.icon}
            </a>
            {open && DropdownMenu()}
        </li>
    )
}

function DropdownMenu(){

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
                <NavLink className="navv1" as={Link} to={"/Signin"}>
                    <h3>
                    Sign In
                    </h3>
                </NavLink>
            </DropdownItem>

            <DropdownItem>
                <NavLink className="navv2" as={Link} to={"/user"}>
                    <h3>
                    My NFTs
                    </h3>
                </NavLink>
            </DropdownItem>
            
            {/*
            <DropdownItem className="navv3">
            <NavLink className="navv3" as={Link} to={"#"}>
                    <h3>
                    Log Off
                    </h3>
                </NavLink>
                </DropdownItem>
            */}
        </div>
    )
}

export default Header;

