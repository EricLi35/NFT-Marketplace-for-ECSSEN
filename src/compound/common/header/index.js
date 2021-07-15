import React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as LoginIcon } from './login.svg';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import Marketplace from "./../../../components/Marketplace";
import Home from '../../../components/Home';
import SignIn from '../../../components/SignIn';
import User from "../../../components/User";
import './bcharity_logo.png';
import './Header.css';
import { nonEmptyArray } from 'check-types';

function Header(){
    const updateNavbar = async (evt) => {
        console.log(evt.target.innerText);
        document.querySelector(".navbar-active").classList.remove("navbar-active");
        document.querySelectorAll(".navbar-item").forEach((item) => {
            if(item.innerText !== evt.target.innerText){
                return;
            }
            item.classList.add("navbar-active");
        });
    }
    return (
        <section className = "navbar">

            <div className = "navbar_logo">
                <img src="./bcharity_logo.png"alt="bcharity_logo"></img>
            </div>
            <div className="navbar_bcharity">
                BCHARITY
            </div>

            <div className = "navbar-item-container">
                <div className="navbar-item navbar-active" onClick={updateNavbar}>
                    <NavLink as={Link} to={"/home"} className="navlink-items">
                        Home
                    </NavLink>
                </div>
                <div className="navbar-item" onClick={updateNavbar}>
                    <NavLink as={Link} to={"/marketplace"} className="navlink-items">
                        Marketplace
                    </NavLink>
                </div>
                <div className="navbar-item" onClick={updateNavbar}>About</div>
             </div>
             <div className="navbar_search">
                 <label className="searchLabel">
                 <input className="searchBar" type="text" placeholder="Search..." />
                 </label>
             </div>
             <Login>
                 <Login_item icon={<LoginIcon />}>
                     <DropdownMenu />
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
            {open && props.children}
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
            
            <DropdownItem className="navv3">
            <NavLink className="navv3" as={Link} to={"#"}>
                    <h3>
                    Log Off
                    </h3>
                </NavLink>
                </DropdownItem>
        </div>
    )
}

export default Header;

