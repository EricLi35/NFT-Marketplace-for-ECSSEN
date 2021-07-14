import React from "react";
import {useEffect, useState} from "react";
import "./index.css";

import detectEthereumProvider from '@metamask/detect-provider';
import { OpenSeaPort, Network } from 'opensea-js';
import { getCookie, smartContract } from '../../constants';
import { func } from "prop-types";

import ProgressBar from "../Progress_bar";

let charityAddrs = {
    "Charity 1 (Tony Address)": "0x11f408335E4B70459dF69390ab8948fcD51004D0",
    "Charity 2 (Rui Address)": "0x6926f20dD0e6cf785052705bB39c91816a753D23",
    "Charity 3 (Ethan Address)": "0x1437B4031f2b6c3a6d1D5F68502407283c3fAE31",
  }

const Donate = () => {

  const API_URL = "https://rinkeby-api.opensea.io/api/v1";

  const [tokenName, setTokenName] = useState("");
  const [tokenCollection, setTokenCollection] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tokenOwnerId, setTokenOwnerId] = useState("");
  const [chosenCharity, setChosenCharity] = useState("");
  const [schemaName, setSchemaName] = useState("");
  const [tokenPrice, setTokenPrice] = useState(-1);

  // progress bar info
  const [progress, setProgress] = useState(0);
  const [progressBg, setProgressBg] = useState("var(--blue-gradient)");
  const [transactionHash, setTransactionHash] = useState("");

  function addSmartContractListener(){
    smartContract.events.Approval({}, (err, data) => {
      if(err){
        console.error(err);
        return;
      } 
      console.log(data);
    })
  }

  useEffect(() => {
    window.addEventListener("load", getDetails);
    addSmartContractListener();
  });

  async function getDetails(){
    let urlParts = window.location.pathname.split('/');
    const [collectionAddr, tokenID] = urlParts.splice(-2);

    fetch(`${API_URL}/asset/${collectionAddr}/${tokenID}`, {method: "GET"})
      .then((res) => res.json())
      .then((json) => updateDetails(json))
      .catch((err) => console.error(err));
  }

  async function updateDetails(tokenData){
    setTokenName(tokenData.name)
    setTokenCollection(tokenData.collection.name);
    setImgUrl(tokenData.image_url);
    setSchemaName(tokenData.asset_contract.schema_name);
    setTokenOwnerId(tokenData.top_ownerships[0].owner.address);

    if(tokenData.orders.length > 0){
      setTokenPrice(tokenData.orders[0].base_price * Math.pow(10, -18));
    }

    console.log(tokenData);
  }


  function updateChosenCharity(evt){
    console.log(evt.target);
    setChosenCharity(evt.target.innerText);
    // now the address of the charity can be retrieved via charityAddrs[chosenCharity];
  }

  async function makeTransfer(){

    setProgress(25);
    const seaport = await getOpenSeaPort();

    let userInfo = JSON.parse(getCookie("uid"));
    const fromAddress = userInfo["walletAddress"];

    let urlParts = window.location.pathname.split('/');
    const [tokenAddress, tokenId] = urlParts.splice(-2); //fetch token address + token ID from URL

    let asset = {tokenId, tokenAddress};
    if (schemaName === "ERC1155") {asset["schemaName"] = "ERC1155"};
    setProgress(50)

    try{
      const th = await seaport.transfer({
          asset,
          fromAddress, //your address (you must own the asset)
          toAddress: charityAddrs[chosenCharity]
      })

      setProgress(75);

      let result = waitForTx(th); //wait until transaction is completed

      setProgress(100);
      setTransactionHash(th);

      if(result === null){
        setProgressBg("var(--failure-color)");
        return;
      }

      setProgressBg("var(--success-color)");
      // document.getElementById("donateButton").innerHTML = "Donation Complete!";
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

  function showDropdownContent() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.allCharitiesButton')) {
      var dropdowns = document.getElementsByClassName("dropdown-content_eric");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  var div = document.getElementsByClassName('dropdown-content_eric');
  for(var i=0 ; i < div.length ; i++){
    for(var j=0 ; j < div[i].children.length ; j++){
      div[i].children[j].addEventListener('click',function(){
        this.parentNode.previousElementSibling.innerHTML = this.innerHTML;
      })
    }
  }

  return(
    <div className="wholeThing">
     <h1>
        Donate Your NFT Here!
    </h1>

    {/* {renderDonateToggle()} */}
    <h3 className="charitySelect">Select your Charity:</h3>
    {/* <p>(Please click the charity twice for confirmation purposes) </p> */}


    {/* this still needs work... 
        i'm adding things to it for now, but again, this need to be reworked
      */}
<div className="dropdown_eric">
  <button className="allCharitiesButton" onClick={showDropdownContent}>All Charities</button>
  <div className="dropdown-content_eric" id="myDropdown">
    <a href="#" onClick={updateChosenCharity} value={Object.values(charityAddrs)[0]}>{((Object.keys(charityAddrs))[0])}</a>
    {/* <a href="#">{((Object.keys(charityAddrs))[1])}</a> */}
    <a href="#">long charity name long charity name </a>
    
    <a href="#" onClick={updateChosenCharity} value={Object.values(charityAddrs)[2]} >{((Object.keys(charityAddrs))[2])}</a>
  </div>
</div>




<div className="thankYou">
<h3>
  Thank you for your kindness and generosity!
  </h3>
    <h4 className="thankYou_sub">Every donation counts, no matter how small!</h4>
    <img className="generous" src="https://content.thriveglobal.com/wp-content/uploads/2020/02/be-generous-1.jpg?w=1550">
</img>
</div>



<div className="nftInfo">
  <h3 className="nftName">{tokenName}</h3>
  <img className="nftImg" src={imgUrl}>
  </img>
</div>


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
<div className="donateButtonDiv">
<button className="donateButton" onClick={() => makeTransfer()}>
        DONATE 
    </button>
</div>


<footer></footer>
    </div>
  );
  
};

export default Donate;
