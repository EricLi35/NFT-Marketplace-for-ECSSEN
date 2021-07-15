/**
 * @author Ethan Sengsavang
 *
 * @version 2021.06.28 - Base development
 * @since 2021.06.28
 */
import React from "react";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import fetch from "node-fetch";

import { OrderSide } from 'opensea-js/lib/types';
import "./index.css"
import detectEthereumProvider from '@metamask/detect-provider';
import { OpenSeaPort, Network } from 'opensea-js';
// import { getCookie, smartContract } from '../../constants';
import { getCookie } from "../../constants";
import ProgressBar from "../Progress_bar";
//import ethUtil from "ethereumjs-util";
//import sigUtil from "eth-sig-util";

const Asset = () => {
  
  const API_URL = "https://rinkeby-api.opensea.io/api/v1";

  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [tokenCollection, setTokenCollection] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tokenOwnerId, setTokenOwnerId] = useState("");
  const [chosenCharity, setChosenCharity] = useState("");
  const [schemaName, setSchemaName] = useState("");
  const [isOnSale, setSaleState] = useState(false);
  const [tokenPrice, setTokenPrice] = useState(-1);
  const [saleType, setSaleType] = useState(0);

  // progress bar info
  const [progress, setProgress] = useState(0);
  const [progressBg, setProgressBg] = useState("var(--blue-gradient)");
  const [transactionHash, setTransactionHash] = useState("");

  /*
  function addSmartContractListener(){
    smartContract.events.Approval({}, (err, data) => {
      if(err){
        console.error(err);
        return;
      }

      console.log(data);
    })
  }//*/

  /**
   * Uses React effects perform one-time actions.
   *
   * - Adds a load event listener to fetch the details of the connected NFT
   */
  useEffect(() => {
    getDetails();
    // addSmartContractListener();
  }, []);

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
    setTokenDescription(tokenData.description);
    setTokenCollection(tokenData.collection.name);
    setImgUrl(tokenData.image_url);
    setSchemaName(tokenData.asset_contract.schema_name);
    setTokenOwnerId(tokenData.top_ownerships[0].owner.address);
    setSaleState(currentlyOnSale(tokenData));
    setSaleType(tokenData.orders[0].payment_token_contract.id); // 2 is a regular listing, 1 is an auction

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
      <button className="buyButtonAsset" id="buyButton" type="button" onClick={() => makeBuyOrder()}>
        Buy
        </button>
    );
  }

  function renderBidToggle(){
    // ensure that the bid is greater than the current highest bid?
    return(
      <div>
        <input type="number" id="bidPrice" placeholder="BID HERE"/>
        <button className="placeBidButton" id="bidButton" type="button" onClick={() => makeBuyOffer()}>Place Bid</button>
      </div>
    )
  }

  function renderSellToggle(){
    let urlParts = window.location.pathname.split('/');
    const [collectionAddr, tokenID] = urlParts.splice(-2);

    return(
      <span>
        <Link to={`/Sell/${collectionAddr}/${tokenID}`}>
          <button id="button" className="sellButtonAsset">
            Sell
          </button>
        </Link>
        
      {/*  onClick={() => makeSellOrder()} className="button"> Sell</button>
        <input type="text" id="salePrice" defaultValue={"0"} placeholder="sale price" />*/}
      </span>
    );
  }

  function renderCancelToggle(){
    return(
      <span>
        <div className="TransactionDetails">
        {
          progress > 0
          ? <ProgressBar completed={progress} bgcolor={progressBg} />
          : <></>
        }
        {
          transactionHash !== ""
          ? <p>Your transaction is: {transactionHash}</p>
          : <p></p>
        }
        </div>

        <button type="button" id="cancelSellButton" onClick={() => cancelOrder()} className="button"> Cancel Sell Listing</button>
      </span>
    );
  }

  function updateChosenCharity(evt){
    setChosenCharity(evt.target.value);
    // now the address of the charity can be retrieved via charityAddrs[chosenCharity];
  }

  function renderDonateToggle(){

    let urlParts = window.location.pathname.split('/');
    const [collectionAddr, tokenID] = urlParts.splice(-2);

    return(
      <div className="donateContainer">
        <Link to={`/Donate/${collectionAddr}/${tokenID}`}>
          <button id="button" className="donateButtonAsset">
            Donate
          </button>
        </Link>
      </div>
    );
  }

  async function makeBuyOrder(){

    setProgress(25);
    const seaport = await getOpenSeaPort()

    let userInfo = JSON.parse(getCookie("uid"));
    const accountAddress = userInfo["walletAddress"];

    let urlParts = window.location.pathname.split('/');
    const [asset_contract_address, token_id] = urlParts.splice(-2); //fetch token address + token ID from URL
    
    setProgress(50)

    try{
      const order = await seaport.api.getOrder({
          side: OrderSide.Sell,
          asset_contract_address,
          token_id,
        });

      setProgress(75);

      const th = await seaport.fulfillOrder({order, accountAddress});

      let result = waitForTx(th); //wait until transaction is completed
      document.getElementById("buyButton").innerHTML = "NFT purchased!";

      setProgress(100);
      setTransactionHash(th);

      if(result === null){
        setProgressBg("var(--failure-color)");
        return;
      }

      setProgressBg("var(--success-color)");
    }catch(err){
      setProgress(100);
      setProgressBg("var(--failure-color)");
      console.error(err);
      return;
    }
  }

    async function makeBuyOffer() {
        setProgress(33);
        const seaport = await getOpenSeaPort()

        let userInfo = JSON.parse(getCookie("uid"));
        const accountAddress = userInfo["walletAddress"];

        let urlParts = window.location.pathname.split('/');
        //console.log(urlParts);
        const [tokenAddress, tokenId] = urlParts.splice(-2); //fetch token address + token ID from URL

        console.log(tokenAddress);
        console.log(tokenId);

        let asset = await seaport.api.getAsset({
            tokenAddress, 
            tokenId
        })

        setProgress(66)

        try {
            const offer = await seaport.createBuyOrder({
                asset,
                accountAddress,
                startAmount: Number(document.getElementById("bidPrice").value)
            })

            setProgress(100);
            document.getElementById("bidButton").innerHTML = "Offer has been placed!";

            setProgressBg("var(--success-color)");

        }catch (err) {
        setProgress(100);
        setProgressBg("var(--failure-color)");
        console.error(err);
        return;
        }
    }

  async function cancelOrder(){

    setProgress(25)
    const seaport = await getOpenSeaPort()
    //Testing some weird stuff with the provider.  
    const provider = await detectEthereumProvider()

    let userInfo = JSON.parse(getCookie("uid"));
    const accountAddress = userInfo["walletAddress"];

    let urlParts = window.location.pathname.split('/');
    const [asset_contract_address, token_id] = urlParts.splice(-2); //fetch token address + token ID from URL

    try{
      const order = await seaport.api.getOrder({
        side: OrderSide.Sell,
        asset_contract_address,
        token_id,
      });

      if (order.r === null || order.s === null || order.v === null){ //check if sell order is auction; if auction, then r s v = null

        var from = order.maker;
        var message = order.hash;
        var params = [from, message];
        var method = "personal_sign";
        var signature;

        await provider.send({
            method,
            params,
            from
        }, function (err, result) {
                if (err) return console.dir(err);
                if (result.error) {
                    alert(result.error.message);
                }
                if (result.error) return console.error('ERROR', result);
                console.log('TYPED SIGNED:' + JSON.stringify(result.result));
                signature = JSON.stringify(result.result);
            }
        );

        signature = signature.substr(3); //remove 0x
        console.log(signature);
        const r = '0x' + signature.slice(0, 64);
        const s = '0x' + signature.slice(64, 128);
        const v = signature.slice(128, 130);
        const v_decimal = parseInt(v, 16); //convert from hexadecimal to decimal
        
        order.r = r;
        order.s = s;
        order.v = v_decimal;

        }
      setProgress(50);

      console.info({ order, accountAddress });

      const th = await seaport.cancelOrder({ order, accountAddress });

      //console.log(th);
      //seaport.cancelOrder is a void function with no return

      setProgress(75);
      //let result = waitForTx(th); //wait until transaction is completed
      document.getElementById("cancelSellButton").innerHTML = "Sell Listing Cancelled";

      setProgress(100);
      //setTransactionHash(th);

      /*
       * removed this since waitForTx(th) has a strange error
      if(result === null){
        setProgressBg("var(--failure-color)");
        return;
      }
      */

      setProgressBg("var(--success-color)");
    }catch(err){
      setProgress(100);
      setProgressBg("var(--failure-color)");
      console.error(err);
      return;
    }
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
    // while (result === null){ //blocking function that resolves after transaction is completed
    result = web3.eth.getTransactionReceipt(tx_hash); 
    // }

    result
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        console.error(err);
        return null;
      });

    //return result;
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

    //console.log(saleType)

    if(saleType === 1){
      return(
        <div className="AssetButtonContainer">
          {renderBidToggle()}
        </div>
      );
    }

    return (
      <div className="AssetButtonContainer"> 
        <div className="TransactionDetails">
        {
          progress > 0
          ? <ProgressBar completed={progress} bgcolor={progressBg} />
          : <></>
        }
        {
          transactionHash !== ""
          ? <p>Your transaction is: {transactionHash}</p>
          : <p></p>
        }
        </div>

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
          <p className="tokenOwner">Owned by: <Link to={`/user/${tokenOwnerId}`}>{tokenOwnerId}</Link></p>
          <div className="tokenDescription">
            <p>{tokenDescription}</p>
          </div>
          <img className="AssetImage" src={imgUrl} alt={"Asset Image"} onLoad={scalePhoto}/>
          <div className="priceField">
            {tokenPrice === -1
              ? <p><i>This is not currently listed for sale</i></p>
              : <h2>Ξ {tokenPrice.toFixed(3)}</h2>
            }
          </div>
          <span className="renderToggles">
            {renderToggles()}
            </span>
        </div>
    </div>
  );
}

export default Asset;
