/**
 * @author Jinhao Li
 * 
 * @version 2021.06.30 - Base development
 * 
 * @since 2021.06.30
 */

import React from 'react';
import { useEffect, useState } from "react";
import './Sell.css';

import { OpenSeaPort, Network } from 'opensea-js';
import { getCookie, onNetworkUpdate, API_URL } from '../../constants';
import detectEthereumProvider from '@metamask/detect-provider';
import ProgressBar from "../Progress_bar";
import ElogDateTime from "./ElogDateTime";


function Sell() {

    const [tokenName, setTokenName] = useState("");
    const [tokenCollection, setTokenCollection] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [schemaName, setSchemaName] = useState("");

    const [fixedPrice, setFixedPrice] = useState(null);
    const [method, setMethod] = useState('set');
    const [bid, setBid] = useState(null);
    const [reserved, setReserved] = useState(null);
    const [expireDate, setExpireDate] = useState(null);
    const [message, setMessage] = useState("");
    const [bidMessage, setBidMessage] = useState(null);
    const [reserveMessage, setReserveMessage] = useState(null);
    const [msg, setMsg] = useState("");
    const [dateMsg, setDateMsg] = useState("");
    const [todayDateTime, setTodayDateTime] = useState('');

    // progress bar info
    const [progress, setProgress] = useState(0);
    const [progressBg, setProgressBg] = useState("var(--blue-gradient)");
    const [transactionHash, setTransactionHash] = useState("");

    /**
     * Uses React effects perform one-time actions.
     *
     * - Adds a load event listener to fetch the details of the connected NFT
     */
    useEffect(() => {
        getDetails();
    }, []);

    /**
     * Gets the details of the connected NFT, found within the url.
     * A valid NFT collection address and tokenID are expected within
     * the url in the format: 
     * <code>https://(URL)/asset/(Collection Address)/(tokenID)</code>
     *
     * Will fetch the data needed from the opensea API and update the page.
     */
    async function getDetails() {
        let urlParts = window.location.pathname.split('/');
        const [collectionAddr, tokenID] = urlParts.splice(-2);

        fetch(`${API_URL}/api/v1/asset/${collectionAddr}/${tokenID}`, { method: "GET" })
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
    async function updateDetails(tokenData) {
        setTokenName(tokenData.name)
        setTokenCollection(tokenData.collection.name);
        setImgUrl(tokenData.image_url);
        setSchemaName(tokenData.asset_contract.schema_name);

        console.log(tokenData);
    }

    function changeData(val) {
        setFixedPrice(val.target.value);
    }

    function changeSellMethod(val) {
        setMethod(val);
    }

    function changeBid(val) {
        setBid(val.target.value);
    }

    function changeReserved(val) {
        setReserved(val.target.value);
    }

    async function makeSellOrder() {

        const seaport = await getOpenSeaPort()

        let urlParts = window.location.pathname.split('/');
        const [tokenAddress, tokenId] = urlParts.splice(-2); //fetch token address + token ID from URL

        let userInfo = JSON.parse(getCookie("uid"));
        const accountAddress = userInfo["walletAddress"];

        let asset = { tokenId, tokenAddress };
        // if (schemaName === "ERC1155") {asset["schemaName"] = "ERC1155"};

        const listing = await seaport.createSellOrder({
            asset,
            accountAddress,
            startAmount: getSalePrice()
        })

        document.getElementsByClassName("post-button")[0].innerHTML = "Your item has been put on sale";
    }

    /*
     * This function would add dutch auction support.  
    async function makeDescendingAuction() {
        const seaport = await getOpenSeaPort()

        let urlParts = window.location.pathname.split('/');
        const [tokenAddress, tokenId] = urlParts.splice(-2); //fetch token address + token ID from URL

        let userInfo = JSON.parse(getCookie("uid"));
        const accountAddress = userInfo["walletAddress"];

        let asset = { tokenId, tokenAddress };

        const dutchAuctionSellOrder = await seaport.createSellOrder({
            asset,
            accountAddress,
            startAmount: getSalePrice(),
            endAmount: getEndPrice(),
            expirationTime: getExpirationTime(),
        });
        document.getElementsByClassName("post-button")[0].innerHTML = "Your dutch auction has been posted";
    }
    */

    async function makeAscendingAuction() {

        setProgress(25);
        const seaport = await getOpenSeaPort()
        //Testing some weird stuff with the provider.  
        const provider = await detectEthereumProvider()

        let urlParts = window.location.pathname.split('/');
        const [tokenAddress, tokenId] = urlParts.splice(-2); //fetch token address + token ID from URL

        let userInfo = JSON.parse(getCookie("uid"));
        const accountAddress = userInfo["walletAddress"];

        let asset = { tokenId, tokenAddress };

        setProgress(50)

        try{
        const EnglishAuctionSellOrder = await seaport.createSellOrder({
            asset,
            accountAddress,
            paymentTokenAddress: getPaymentToken(),
            startAmount: getMinBid(),
            waitForHighestBid: true,
            expirationTime: setExpirationTime(),
            englishAuctionReservePrice: getReservePrice()
        });

        setProgress(75);
        document.getElementsByClassName("post-button")[0].innerHTML = "Your auction has been set up";
        console.log(EnglishAuctionSellOrder);
        setTransactionHash(EnglishAuctionSellOrder.hash);
        setProgress(100);
        setProgressBg("var(--success-color)");
        }catch(err){
          console.error(err);
          setProgress(100);
          setProgressBg("var(--failure-color)");
        }
    }

    async function getOpenSeaPort() {
        const provider = await detectEthereumProvider();
        return new OpenSeaPort(provider, {
            networkName: Network.Rinkeby
        });
    }

    function getReservePrice() {
        return Number(document.getElementById("reserve-p").value);
    }

    function getSalePrice() {
        return Number(document.getElementById("salePrice").value);
    }

    function setExpirationTime() {
        //console.log(document.getElementById("elogdate").value + "T" + document.getElementById("elogtime").value);
        return Number(Math.round(new Date(document.getElementById("elogdate").value + "T" + document.getElementById("elogtime").value) / 1000));
    }

    function getMinBid() {
        return Number(document.getElementById("min-bid").value);
    }
    /*
     * This is required for dutch auctions, but not for English auctions.  
    function getEndPrice() {
        return Number(document.getElementById("endPrice").value);
    }
    */
    function getPaymentToken() {
        //Currently only returns weth's Address depending on whether the network is on mainnet or Rinkeby.  
        //Modify this to take in the input payment token address when the input criteria becomes available and default to weth if none is entered.  
        const wethAddress =
            Network === "mainnet" || Network === "live"
                ? "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                : "0xc778417e063141139fce010982780140aa0cd5ab";
        return wethAddress;
    }

    function validateFixedPrice() {
        setMessage("")
        if (fixedPrice === null){
            setMessage("Input price cannot be null.")
            return false;
        }
        if (fixedPrice === ''){
            setMessage("Input price cannot be null.")
            return false;
        }
        if (fixedPrice.includes('-')){
            setMessage("The price you entered is invalid.")
            return false;
        }
        if (fixedPrice.includes('+')){
            setMessage("The price you entered is invalid.")
            return false;
        }
        return true
    }

    function handlePostFixedPrice() {
        const isValid = validateFixedPrice();
        if (isValid){
            console.log("This Item will be sold") //call the sell function here
            makeSellOrder();
        }
    }

    function validateBid(){
        setBidMessage("")
        if ((bid === null) || (bid === '') || (bid.includes('+')) || (bid.includes('-'))){
            setBidMessage("Invalid Minimum Bid input.")
            return false;
        }
        return true;
    }

    function validateReserved(){
        setReserveMessage("")
        if ((reserved === null) || (reserved === '') || (reserved.includes('+')) || (reserved.includes('-'))){
            setReserveMessage("Invalid Reserved Price input.")
            return false;
        }
        return true;
    }

    function validateReservedGreaterThanBid(){
        setMsg("")
        if (Number(bid) < Number(reserved)){
            return true;
        }
        setMsg("The reserved price must be greater than the start price.")
        return false;
    }

    function validateDate(){
        setDateMsg("")
        getCurrentDate();
        if ((expireDate === null) || (expireDate === '') || (expireDate==='0000-00-00 00:00') || (expireDate <= todayDateTime)){
            setDateMsg("Expiration time must be at least 2 minute from now.")
            return false;
        }
        return true;
    }

    function handlePostBid(){
        const bidIsValid = validateBid();
        const reservedIsValid = validateReserved();
        const dateIsValid = validateDate();
        if (bidIsValid && reservedIsValid && dateIsValid){
            const reservedGreaterThanBid = validateReservedGreaterThanBid();
            if (reservedGreaterThanBid){
                console.log("This item will be on auction")
                makeAscendingAuction();
            }
        }
    }

    function getCurrentDate(){
        var current = new Date()
        var today = new Date()
        today.setTime(current.getTime() + (2*60*1000));

        if (today.getMonth() < 9){
            var currentDate = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-' + today.getDate();
        } else {
            var currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        }
        var currentTime = today.getHours() + ':' + today.getMinutes();
        var dateTime = currentDate + " " + currentTime;
        setTodayDateTime(dateTime)
    }

    return (
        <section className='sellPage'>
            <div className="sellTokenInfo">
                <h1 className="sellTokenName">{tokenName}</h1>
                <p className="sellTokenCollection"><i>{tokenCollection}</i></p>
                <img src={imgUrl} alt={"Asset Image"} className="SellImage" />
            </div>

            <div className='sellpage-main'>
                <div className='sellpage-top-set-price'>
                    <h3 className='select-your-sell-methods'>Select your sell method</h3>
                    <br />
                    {
                        method === 'set' &&
                        <div>
                            <div className='sell-methods'>
                                <button className='selected-sell-methods-items' onClick={() => changeSellMethod('set')}>
                                    <h4>Set Price</h4>
                                    <p>Sell at a fixed price</p>
                                </button>
                                <button className='sell-methods-items' onClick={() => changeSellMethod('bid')}>
                                    <h4>Highest Bid</h4>
                                    <p>Auction to the highest bidder</p>
                                </button>
                            </div>
                        </div>
                    }
                    {
                        method === 'bid' &&
                        <div>
                            <div className='sell-methods'>
                                <button className='sell-methods-items' onClick={() => changeSellMethod('set')}>
                                    <h4>Set Price</h4>
                                    <p>Sell at a fixed price</p>
                                </button>
                                <button className='selected-sell-methods-items' onClick={() => changeSellMethod('bid')}>
                                    <h4>Highest Bid</h4>
                                    <p>Auction to the highest bidder</p>
                                </button>
                            </div>
                        </div>
                    }
                    <hr />
                    <div>
                    {
                        method === 'set' &&
                        <div>
                            <div className='set-sell-price'>
                                <div className='set-sell-price-left'>
                                    <h3 className='price'>Price</h3>
                                    <p className='price-description'>Will be on sale until you transfer this item or cancel it.</p>
                                </div>
                                <div className='set-sell-price-right'>
                                    <input type="number" min="0"
                                    placeholder=" Amount" id="salePrice" onChange={changeData} />
                                </div>
                            </div>
                        </div>
                    }
                    {
                        method === 'bid' &&
                        <div className='auction'>
                            <div className='minimum-bid'>
                                <div className='set-minimum-bid-left'>
                                    <h3 className='minimum'>Minimum Bid</h3>
                                    <p className='minimum-bid-description'>Set your public starting bid price.</p>
                                </div>
                                <div className='set-minimum-bid-right'>
                                    <input type="number" placeholder=" Amount" id="min-bid" onChange={changeBid} />
                                </div>
                            </div>
                            <hr />
                            <div className='reserve-price'>
                                <div className='reserve-price-left'>
                                    <h3 className='reserve'>Reserve price</h3>
                                    <p className='reserve-price-description'>Create a hidden limit by setting a reserve price.</p>
                                </div>
                                <div className='reserve-price-right'>
                                    <input type="number" placeholder=" Amount" id="reserve-p" onChange={changeReserved} />
                                </div>
                            </div>
                            <hr />
                            <div className='expiration-date'>
                                <div className='expiration-date-left'>
                                    <h3 className='expire-date'>Expiration Time</h3>
                                    <p className='expiration-date-description'>Your auction will automatically end at this time and the highest bidder will win. No need to cancel it!</p>
                                </div>
                                <div className='expiration-date-right'>
                                    <ElogDateTime handleChange={(val) => {
                                        setExpireDate(val);
                                    }} />
                                </div>
                            </div>
                        </div>
                    }
                    </div>
                </div>

                {/* Summary part of the page */}
                <div className='sellpage-top-summary'>
                    <h1 className='summary'>Summary</h1>
                    <hr />
                    <div className='listing-section'>
                        <h3 className='listing'>Listing</h3>
                        {
                            method === 'set' &&

                            <div>
                                <p className='listing-description'>Your item will be listed for {fixedPrice}.
                                </p>
                                <p className='listing-error-message'>{message}</p>
                                {/* <button className='post-button' onClick={() => makeSellOrder()}>Post your listing</button> */}
                                <button className='post-button' onClick={() => handlePostFixedPrice()}>Post your listing</button>
                            </div>
                        }
                        {
                            method === 'bid' &&
                            <div>
                                <p className='listing-description'>Your item will be auctioned.
                                The highest bidder will win it on {expireDate}, as long as their bid is at least {reserved}.</p>
                                <p className='listing-error-message'>{bidMessage}</p>
                                <p className='listing-error-message'>{reserveMessage}</p>
                                <p className='listing-error-message'>{dateMsg}</p>
                                <p className='listing-error-message'>{msg}</p>
                                {/* <button className='post-button' onClick={() => makeAscendingAuction()}>Post your listing</button> */}
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
                                <button className='post-button' onClick={() => handlePostBid()}>Post your listing</button>
                            </div>
                        }
                    </div>
                    <hr />
                    <div className='fees-section'>
                        <h3 className="fees">Fees</h3>
                        <p className="fees-description">Listing is free! No fees are going to be deducted.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Sell
