/**
 * @author Ethan Sengsavang
 *
 * @version 06.29.2021
 * @since 06.29.2021
 */
import React from "react";
import ReactDOM from "react-dom";
import {useEffect, useState} from "react";
import "./index.css";
import {getCookie} from "../../constants";
import fetch from "node-fetch"
import AssetMetadata from "../common/assetInfo/AssetMetadata.js";
import {Plus} from "react-bootstrap-icons";

const User = () => {
  const API_URL = "https://rinkeby-api.opensea.io/api/v1";

  const [walletAddress, setWalletAddress] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const [userAssets, setUserAssets] = useState([]);

  useEffect(() => {
    let userCookie = getCookie("uid");

    if(userCookie === undefined){
      window.location.reload(false);
    }

    let userData = JSON.parse(userCookie);

    if(userData.walletAddress === ""){
      setLoginStatus(false);
      return;
    }

    setLoginStatus(true);
    setWalletAddress(userData.walletAddress);

    if(walletAddress.length === 0) return;
    fetchAssets();
  });

  /**
   * Fetches Assets the user has associated to their wallet if they have any.
   * These assets will be stored in a state variable.
   */
  async function fetchAssets(){
    let limit = 20;
    let offset = userAssets.length;

    fetch(`${API_URL}/assets?order_by=token_id&limit=${limit}&offset=${offset}&owner=${walletAddress}`)
    .then((resp) => resp.json())
    // .then((json) => console.log(json))
    .then((json) => updateAssets(json.assets))
    .catch((err) => console.error(err.message));
  }

  /**
   * Renders a given asset within a card, as specified by the AssetMetadata styles
   *
   * @param asset A NFT token represented by a JavaScript object.
   */
  async function renderAssetCard(asset){
    return(
      <div className="AssetCard" key={asset.id}>
        {
          asset
          ? <AssetMetadata asset={asset} />
          : <p>Nothing to see here :)</p>
        }
      </div>
    );
  }

  async function updateAssets(assetList){
    for(let index in assetList){
      let asset = assetList[index];
      let assetHTML = await renderAssetCard(asset);
      userAssets.push(assetHTML);
      setUserAssets(userAssets);
    }
    console.log(userAssets);
    ReactDOM.render(userAssets, document.querySelector(".UserAssets"));
  }

  /**
   * Displays everything about the user, if they are signed in at the moment
   */
  function displayUserInfo(){
    return(
      <div className="UserInfoContainer">
        <div className="UserStyleContainer" 
          style={{
            backgroundImage: `url(${"https://64.media.tumblr.com/fa9e3596b53edece325c9e2a1181994d/tumblr_pul9fipFgY1wnjxxqo6_1280.png"})`,
          }}
        >
          <div className="ProfileInfo">
            <div className="ProfilePicContainer">
              <img alt="" src={"https://images.rawpixel.com/image_png_1300/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvdjc5MC1udW5ueS01Mi5wbmc.png?s=ievT3yCXyRc_rXnYNPZw3EoVeSekrNN2d_0vy5gaF9Y"} />
            </div>
            <p>&nbsp;{walletAddress}</p>
          </div>
        </div>
        <div className="UserAssetContainer">
          <div><h2>Your Assets</h2></div>
          <a href="/Create">
            <button className="UserCreateButton">
              <Plus className="UserCreatePlus" />
              <p>Mint a new Token </p>
            </button>
          </a>
          <div className="UserAssets">
            {userAssets}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Displays a page to go to the sign-in page if the user is not logged in
   */
  function displayLoginError(){
    return(
      <div className="LoginError">
        <h1>You are not signed in at the moment</h1>
        <h3>Please Sign-In <a href="/signin">here</a></h3>
      </div>
    );
  }

  return(
    <div className="UserContainer">
      <h2>User</h2>
      {
        loginStatus? displayUserInfo() : displayLoginError()
      }
    </div>
  );
}

export default User;
