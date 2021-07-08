import React from "react";
import {useEffect, useState} from "react";
import fetch from "node-fetch";
import "./index.css";

import detectEthereumProvider from '@metamask/detect-provider';
import { OpenSeaPort, Network } from 'opensea-js';
import { getCookie, smartContract } from '../../constants';
import { func } from "prop-types";



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
    setChosenCharity(evt.target.innerHTML);
    // now the address of the charity can be retrieved via charityAddrs[chosenCharity];
  }

 function createCharityRadio(charityName) {
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
    const charities = Object.entries(charityAddrs);
    
    for (let charity in charities) {

        charities.push(createCharityRadio(charity));

    }

    return (
        <div className="donateContainer">
            <button className="button" onClick={() => makeTransfer()}>Donate</button>
            <form className="charitySelection">
              {charities}
            </form>
        </div>
    );
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
  } 

  async function getOpenSeaPort(){
    const provider = await detectEthereumProvider();
    return new OpenSeaPort(provider, {
        networkName: Network.Rinkeby
    });
  }



  function showDropdownContent() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.allCharitiesButton')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

var div = document.getElementsByClassName('dropdown-content');
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
        <br></br>
        Donate Your NFT Here!
    </h1>

    {/* {renderDonateToggle()} */}
    <h3 className="charitySelect">Select your Charity:</h3>
    <p>(Please click the charity twice for confirmation purposes) </p>


<div className="dropdown">
  <button className="allCharitiesButton" onClick={showDropdownContent}>All Charities</button>
  <div className="dropdown-content" id="myDropdown">
    <a href="#" onClick={updateChosenCharity}>{((Object.keys(charityAddrs))[0])}</a>
    <a href="#" onClick={updateChosenCharity}>{((Object.keys(charityAddrs))[1])}</a>
    <a href="#" onClick={updateChosenCharity}>{((Object.keys(charityAddrs))[2])}</a>
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
  <img className="nftImg" src={imgUrl} alt={"Asset Image"}></img>
</div>
<div className="donateButtonDiv">

<button className="donateButton" onClick={() => makeTransfer()}> 
        DONATE 
    </button>
</div>

<footer></footer>
    </div>
  ); //both renderDonateToggle() functions are not used anywhere. have to add makeTransfer() onClick event here.
  
};

export default Donate;
