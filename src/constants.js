import * as Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { PortisProvider } from 'portis'

/*
import env from "react-dotenv";
import {createAlchemyWeb3} from "@alch/alchemy-web3"
const contractABI = require("./token_abi.json");
const contractAddress = "0x5f0ea95e05af06499b4f91a772f781816122dd54";
const web3 = createAlchemyWeb3(alchemyKey);

export const smartContract = new web3.eth.Contract(contractABI, contractAddress);
// */

export const NETWORK = process.env.REACT_APP_NETWORK;
console.log(NETWORK);

export const OPENSEA_URL = "https://opensea.io"
export const OPENSEA_JS_URL = "https://github.com/ProjectOpenSea/opensea-js"
export const GITHUB_URL = "https://github.com/BCharity-Net/nft-frontend"
export const DEFAULT_DECIMALS = 18
export const API_URL = NETWORK !== "mainnet" ? "https://rinkeby-api.opensea.io" : "https://api.opensea.io";
export const ETHERSCAN_URL = NETWORK !== "mainnet" ? "https://rinkeby.etherscan.io" : "https://etherscan.io";
export let web3Provider = typeof web3 !== 'undefined'
  ? window.web3.currentProvider
  : new Web3.providers.HttpProvider('https://mainnet.infura.io')

// Replace this with Redux for more complex logic
const networkCallbacks = []
export const onNetworkUpdate = (callback) => {
  networkCallbacks.push(callback)
}

export async function connectWallet() {
  if (!window.web3) {
    web3Provider = new PortisProvider({
      // Put your Portis API key here
    })
  } else if (window.ethereum) {
    window.ethereum.enable()
  } else {
    const errorMessage = 'You need an Ethereum wallet to interact with this marketplace. Unlock your wallet, get MetaMask.io or Portis on desktop, or get Trust Wallet or Coinbase Wallet on mobile.'
    alert(errorMessage)
    throw new Error(errorMessage)
  }
  networkCallbacks.map((c) => c(web3Provider))
}

export function toUnitAmount(baseAmount, tokenContract = null) {
  const decimals = tokenContract && tokenContract.decimals != null
    ? tokenContract.decimals
    : DEFAULT_DECIMALS

  const amountBN = new BigNumber(baseAmount.toString())
  return amountBN.div(new BigNumber(10).pow(decimals))
}

export function toBaseUnitAmount(unitAmount, tokenContract = null) {
  const decimals = tokenContract && tokenContract.decimals != null
    ? tokenContract.decimals
    : DEFAULT_DECIMALS

  const amountBN = new BigNumber(unitAmount.toString())
  return amountBN.times(new BigNumber(10).pow(decimals))
}

export async function promisify(inner) {
  return new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }
      resolve(res)
    })
  )
}


/**
 * Saves the user's information in a cookie that persists througout the entire website.
 *
 * @param userInfo The user's information in a javascript object. This will be 
 * stringified and be saved in a cookie.
 *
 * The userInfo object should be formatted as so:
 * {
 *   walletAddress, // must be non-empty, otherwise the cookie is deleted.
 * }
 *
 * Information should now be assessible via the getCookie function in
 * ./constants via getCookie("uid");
 *
 * note: the value of the cookie should be parsed as a JSON object
 */
export function saveUserInfo(userInfo){

  let userString = JSON.stringify(userInfo);
  // cookie expires in 24hr
  let expiryDate = new Date();
  expiryDate.setDate(new Date().getDate() + 1);

  document.cookie = `uid=${userString}; expires=${expiryDate}; SameSite=Lax; path=/`;

  // console.log(JSON.parse(getCookie("uid"))); // DEBUG
}

/**
 * returns the cookie with the given name, or undefined if not found
 */
export function getCookie(name){
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
