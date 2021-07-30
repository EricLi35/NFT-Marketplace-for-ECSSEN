/**
 * @author Ethan Sengsavang
 *
 * @version 06.29.2021
 * @since 06.29.2021
 */
import React from "react";
import ReactDOM from "react-dom";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import "./index.css";
import {getCookie, API_URL} from "../../constants";
import fetch from "node-fetch"
import AssetMetadata from "../common/assetInfo/AssetMetadata.js";
import {Plus, ArrowRightShort, ArrowLeftShort} from "react-bootstrap-icons";

const User = () => {

  const [walletAddress, setWalletAddress] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const [myAccount, setMyAccount] = useState(true);
  const [userAssets, setUserAssets] = useState(new Array(20));
  const [assetPage, setAssetPage] = useState(0);
  const [emptyPage, setEmptyPage] = useState(false);
  const [enableNext, setEnableNext] = useState(true);
  const [enablePrevious, setEnablePrevious] = useState(false);

  useEffect(() => {
    getUrlAddress();
  }, []);

  async function getUrlAddress(){
    let urlEnd = window.location.pathname.split('/').slice(-1);
    if(urlEnd[0] !== "user"){
      setWalletAddress(urlEnd[0]);
      setLoginStatus(true);
      setMyAccount(false);
      fetchAssets(0, urlEnd[0]);
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
    fetchAssets(0, userData.walletAddress);
  }

  /**
   * Fetches Assets the user has associated to their wallet if they have any.
   * These assets will be stored in a state variable.
   */
  function fetchAssets(page, wa){
    wa = wa || walletAddress;
    console.log(wa);
    let limit = 20;
    let offset = limit * page;

    if(wa === undefined || wa === 0){return;}

    fetch(`${API_URL}/api/v1/assets?order_by=token_id&limit=${limit}&offset=${offset}&owner=${wa}`)
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

    setEmptyPage(assetPage === 0 && htmlList.length === 0);

    setEnableNext(htmlList.length === 20);
  }

  async function switchPage(increment){
    if(increment + assetPage < 0){return;}
    await setAssetPage(assetPage + increment);
    fetchAssets(assetPage + increment);
  }

  function renderCreateLink(){
    return(
      <Link to="/Create" className="CreateLink">
        <button className="UserCreateButton">
          <Plus className="CreatePlus" />
          <p>Mint a new Token </p>
        </button>
      </Link>
    )
  }

  function renderCreateAssets(){
    return(
      <div className="emptyAssetList">
        <h1>💭</h1>
        <h2>Don't have any tokens?</h2>
        <h3>Create your own!</h3>
        {renderCreateLink()}
        <p className="disclaimerText"><i>If you believe this is an error, please refresh the page.</i></p>
      </div>
    )
  }

  function renderAssetList(){
    return(
      <div>
        {
          myAccount
          ? renderCreateLink()
          : <></>
        }
        <div className="UserAssets">
          {userAssets}
        </div>
      </div>
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
          <h2>{
            myAccount
            ? "Your Assets"
            : "Their Assets"
          }</h2>
          {
            emptyPage
              ? renderCreateAssets()
              : renderAssetList()
          }
          <div className="pageButtons">
            <button
              className="pageSwitch"
              id="prev"
              onClick={enablePrevious? () => switchPage(-1) : () => {}}
              disabled={!enablePrevious}
              >
                <ArrowLeftShort />
            </button>
            <button
              className="pageSwitch"
              id="next"
              onClick={enableNext? () => switchPage(1) : () => {}}
              disabled={!enableNext}
            >
              <ArrowRightShort />
            </button>
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
        <h3>Please Sign-In <Link to="/signin">here</Link></h3>
      </div>
    );
  }

  return(
    <div className="UserContainer">
      {
        loginStatus? displayUserInfo() : displayLoginError()
      }
    </div>
  );
}

export default User;
