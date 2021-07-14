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
  const [myAccount, setMyAccount] = useState(true);
  const [userAssets, setUserAssets] = useState(new Array(20));
  const [assetPage, setAssetPage] = useState(0);
  const [enableNext, setEnableNext] = useState(true);
  const [enablePrevious, setEnablePrevious] = useState(false);

  useEffect(() => {
    getUrlAddress();
    window.addEventListener("load", () => {
      fetchAssets(0);
    });
  });

  async function getUrlAddress(){
    let urlEnd = window.location.pathname.split('/').slice(-1);
    if(urlEnd[0] !== "user"){
      setWalletAddress(urlEnd[0]);
      setLoginStatus(true);
      setMyAccount(false);
      return;
    }

    let userCookie = await getCookie("uid");

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
  }

  /**
   * Fetches Assets the user has associated to their wallet if they have any.
   * These assets will be stored in a state variable.
   */
  async function fetchAssets(page){
    let limit = 20;
    let offset = limit * page;

    if(walletAddress === undefined || walletAddress.length === 0){return;}

    fetch(`${API_URL}/assets?order_by=token_id&limit=${limit}&offset=${offset}&owner=${walletAddress}`)
    .then((resp) => resp.json())
    // .then((json) => console.log(json))
    .then((json) => updateAssets(json.assets))
    .catch((err) => console.error(err.message));

    setEnablePrevious(page > 0);
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
    console.log(assetList);
    let htmlList = []

    for(let index in assetList){
      let asset = assetList[index];
      let assetHTML = await renderAssetCard(asset);

      htmlList.push(assetHTML);
    }
    setUserAssets(htmlList);

    setEnableNext(htmlList.length === 20);
  }

  async function switchPage(increment){
    if(increment + assetPage < 0){return;}
    await setAssetPage(assetPage + increment);
    fetchAssets(assetPage + increment);
  }

  function renderCreateLink(){
    return(
      <a href="/Create">
        <button className="CreateButton">
          <Plus className="CreatePlus" />
          <p>Mint a new Token </p>
        </button>
      </a>
    )
  }

  /**
   * Displays everything about the user, if they are signed in at the moment
   */
  function displayUserInfo(){
    return(
      <div className="UserInfoContainer">
        <div className="UserStyleContainer" 
          style={{
            backgroundImage: `url(${"https://cdn.pixabay.com/photo/2015/04/05/16/12/lego-708088_960_720.jpg"})`,
          }}
        >
          <div className="ProfileInfo">
            <div className="ProfilePicContainer">
              <img alt="" src={"https://randomuser.me/api/portraits/lego/1.jpg"} />
            </div>
            <p>&nbsp;{walletAddress}</p>
          </div>
        </div>
        <div className="UserAssetContainer">
          <h2>{
            myAccount
            ? "Your Assets"
            : "Their Assets"
          }</h2>
          {
            myAccount
            ? renderCreateLink()
            : <></>
          }
          <div className="UserAssets">
            {userAssets}
          </div>
          <button onClick={enableNext? () => switchPage(1) : () => {}}>Next</button>
          <button onClick={enablePrevious? () => switchPage(-1) : () => {}}>Previous</button>
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
