/**
 * @author Ethan Sengsavang
 *
 * @version 2021.06.28 - Base development
 * @since 2021.06.28
 */
import React from "react";
import {useEffect, useState} from "react";
import fetch from "node-fetch";

import { OrderSide } from 'opensea-js/lib/types';
import "./index.css"
import detectEthereumProvider from '@metamask/detect-provider';
import { OpenSeaPort, Network } from 'opensea-js';
import { getCookie } from '../../constants';

var charityAddrs = {
  "Charity 1 (Tony Address)": "0x11f408335E4B70459dF69390ab8948fcD51004D0",
  "Charity 2 (Rui Address)": "0x6926f20dD0e6cf785052705bB39c91816a753D23",
  "Charity 3 (Ethan Address)": "0x1437B4031f2b6c3a6d1D5F68502407283c3fAE31",
}

const Asset = () => {
  const API_URL = "https://rinkeby-api.opensea.io/api/v1";

  const [tokenName, setTokenName] = useState("");
  const [tokenCollection, setTokenCollection] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tokenOwnerId, setTokenOwnerId] = useState("");
  const [chosenCharity, setChosenCharity] = useState("");
  const [schemaName, setSchemaName] = useState("");
  const [isOnSale, setSaleState] = useState(false);
  const [tokenPrice, setTokenPrice] = useState(-1);

  /**
   * Uses React effects perform one-time actions.
   *
   * - Adds a load event listener to fetch the details of the connected NFT
   */
  useEffect(() => {
    window.addEventListener("load", getDetails);
  });

  /**
   * Gets the details of the connected NFT, found within the url.
   * A valid NFT collection address and tokenID are expected within
   * the url in the format:
   * <code>https://(URL)/asset/(Collection Address)/(tokenID)</code>
   *
   * Will fetch the data needed from the opensea API and update the page.
   */
  async function getDetails(){
    let urlParts = window.location.pathname.split('/');
    const [collectionAddr, tokenID] = urlParts.splice(-2);

    fetch(`${API_URL}/asset/${collectionAddr}/${tokenID}`, {method: "GET"})
      .then((res) => res.json())
      .then((json) => updateDetails(json))
      .catch((err) => console.error(err));
  }

  /**
   * Updates the page with the new token details
   *
   * @param tokenData {Object} the parsed JSON object retrieved after fetching
   * details from the opensea API.
   */
  async function updateDetails(tokenData){
    setTokenName(tokenData.name)
    setTokenCollection(tokenData.collection.name);
    setImgUrl(tokenData.image_url);
    setSchemaName(tokenData.asset_contract.schema_name);
    setTokenOwnerId(tokenData.top_ownerships[0].owner.address);
    setSaleState(currentlyOnSale(tokenData));

    if(tokenData.orders.length > 0){
      setTokenPrice(tokenData.orders[0].base_price * Math.pow(10, -18));
    }

    console.log(tokenData);
  }

  function scalePhoto(event){
    let height = event.target.height;
    let width = event.target.width;

    if(height < 100 && width < 100){
      event.target.classList.add("TinyImg");
    }

    event.target.classList.add("AssetImage");
  }
   
  function currentlyOnSale(tokenData){ //checks if the displayed NFT is listed for sale

    var arrayLength = tokenData.orders.length;
    for (var i = 0; i < arrayLength; i++){
      if (tokenData.orders[i].side === 1){ //if order is a sell listing
        return true;
      }
    }

  } 

  function renderBuyToggle(){
    return(
      <button className="button" id="buyButton" type="button" onClick={() => makeBuyOrder()}>Buy</button>
    );
  }

  function renderSellToggle(){
    return(
      <span>
        <button type="button" id="sellButton"  onClick={() => makeSellOrder()} className="button"> Sell</button>
        <input type="text" id="salePrice" defaultValue={"0"} placeholder="sale price" />
      </span>
    );
  }

  function renderCancelToggle(){
    return(
      <span>
        <button type="button" id="cancelSellButton" onClick={() => cancelOrder()} className="button"> Cancel Sell Listing</button>
      </span>
    );
  }

  // TEMP
  function getSalePrice(){
    return Number(document.getElementById("salePrice").value);
  }

  function updateChosenCharity(evt){
    setChosenCharity(evt.target.value);
    // now the address of the charity can be retrieved via charityAddrs[chosenCharity];
  }

  function createCharityRadio(charityName){
    return(
      <span className="charityRadio">
      <div key={charityName}>
        <span className="charityInput">
          <input className="charityNameInput" type="radio" value={charityName} id={charityName}
            name="chosenCharity" onChange={updateChosenCharity}/>
          <span className="charityInputControl"></span>
        </span> 
        <label htmlFor={charityName} className="charityName">{charityName}</label>
      </div>
      </span>
    );
  }

  function renderDonateToggle(){
    let charities = [];
    let counter = 0;

    for(let charity in charityAddrs){
      charities.push(createCharityRadio(charity));
    }

    return(
      <div className="donateContainer">
        <button className="button" id="donateButton" onClick={() => makeTransfer()}>Donate</button>
        <form className="charitySelection">
          {charities}
        </form>
      </div>
    );
  }

  async function makeSellOrder(){

    const seaport = await getOpenSeaPort()
 
    let urlParts = window.location.pathname.split('/');
    const [tokenAddress, tokenId] = urlParts.splice(-2); //fetch token address + token ID from URL

    let userInfo = JSON.parse(getCookie("uid"));
    const accountAddress = userInfo["walletAddress"];

    let asset = {tokenId, tokenAddress};
    if (schemaName === "ERC1155") {asset["schemaName"] = "ERC1155"};

    const listing = await seaport.createSellOrder({
    asset,
    accountAddress,
    startAmount: getSalePrice()})

    document.getElementById("sellButton").innerHTML = "NFT listed for sale";

  }

  async function makeBuyOrder(){

    const seaport = await getOpenSeaPort()

    let userInfo = JSON.parse(getCookie("uid"));
    const accountAddress = userInfo["walletAddress"];

    let urlParts = window.location.pathname.split('/');
    const [asset_contract_address, token_id] = urlParts.splice(-2); //fetch token address + token ID from URL

    const order = await seaport.api.getOrder({
      side: OrderSide.Sell,
      asset_contract_address,
      token_id,
        });
    
    const transactionHash = await seaport.fulfillOrder({order, accountAddress});

    waitForTx(transactionHash); //wait until transaction is completed
    document.getElementById("buyButton").innerHTML = "NFT purchased!";

  }

  async function cancelOrder(){

    const seaport = await getOpenSeaPort()

    let userInfo = JSON.parse(getCookie("uid"));
    const accountAddress = userInfo["walletAddress"];

    let urlParts = window.location.pathname.split('/');
    const [asset_contract_address, token_id] = urlParts.splice(-2); //fetch token address + token ID from URL

    const order = await seaport.api.getOrder({
      side: OrderSide.Sell,
      asset_contract_address,
      token_id,
        });

    const transactionHash = await seaport.cancelOrder({order, accountAddress});

    waitForTx(transactionHash); //wait until transaction is completed
    document.getElementById("cancelSellButton").innerHTML = "Sell Listing Cancelled";

  }

  async function makeTransfer(){

    const seaport = await getOpenSeaPort();

    let userInfo = JSON.parse(getCookie("uid"));
    const fromAddress = userInfo["walletAddress"];

    let urlParts = window.location.pathname.split('/');
    const [tokenAddress, tokenId] = urlParts.splice(-2); //fetch token address + token ID from URL

    let asset = {tokenId, tokenAddress};
    if (schemaName === "ERC1155") {asset["schemaName"] = "ERC1155"};

    const transactionHash = await seaport.transfer({
      asset,
      fromAddress, //your address (you must own the asset)
      toAddress: charityAddrs[chosenCharity]
    })

    waitForTx(transactionHash); //wait until transaction is completed
    document.getElementById("donateButton").innerHTML = "Donation Complete!";

  }

  async function getOpenSeaPort(){
    const provider = await detectEthereumProvider();
    return new OpenSeaPort(provider, {
      networkName: Network.Rinkeby
    });
  }

  function waitForTx(tx_hash){

    var Web3 = require("web3");
    const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-rinkeby.alchemyapi.io/v2/TDvA5STwGZ7Uv_loxm5msg-tuujVCk4_')); //read-only provider

    var result = null;
    while (result === null){ //blocking function that resolves after transaction is completed
      result = web3.eth.getTransactionReceipt(tx_hash); 
    }
  }

  function renderToggles(){

    let userInfo = JSON.parse(getCookie("uid"));
    const userAddress = userInfo["walletAddress"];
    var isOwner = false;

    if (userAddress === tokenOwnerId){ //check if the user owns the NFT displayed
      isOwner = true;
    }

    if(isOwner){ 
       if(isOnSale){
        return (
            <div className="AssetButtonContainer">
              {renderCancelToggle()}
            </div>
          );
        } else {
          return (
            <div className="AssetButtonContainer">
              {renderDonateToggle()}
              {renderSellToggle()}
            </div>
          );    
       }
    }

    return (
      <div className="AssetButtonContainer">
        {renderBuyToggle()}
      </div>
    );
  }

  return(
    <div className="AssetContainer">
      <h2>Asset page</h2>
        <div className="AssetContent">
          <h1 className="tokenName">{tokenName}</h1>
          <p className="tokenCollection"><i>{tokenCollection}</i></p>
          <p className="tokenOwner">Owned by: <a href="#">{tokenOwnerId}</a></p>
          <img src={imgUrl} alt={"Asset Image"} onLoad={scalePhoto}/>
          <div className="priceField">
            {tokenPrice === -1
              ? <p><i>This is not currently listed for sale</i></p>
              : <h2>Ξ {tokenPrice.toFixed(3)}</h2>
            }
          </div>
          <span className="renderToggles">{renderToggles()}</span>
        </div>
    </div>
  );
}

export default Asset;
