import React, {useState} from "react";
import "./index.css";

const LogOff = () => {



// This function will connect the user's Metamask to dApp
// export const connectWallet = async () => {
//     if (window.ethereum){
//         try{
//             const addressArray = await window.ethereum.request({
//                 method: "eth_requestAccounts",
//             });

//             const obj = {
//                 status: "Write a message in the text-field above",
//                 address: addressArray[0],
//             };
//             return obj;
//         } catch (err){
//             return {
//                 address: "",
//                 status: "An error occured" + err.message,
//             };
//         }
//     } else {
//         return {
//             address: " ",
//             status: (
//                 <span>
//                     <p>
//                         <a target="_blank" href={`https://metamask.io/download.html`}>
//                             You must install Metamask in your browser
//                         </a>
//                     </p>
//                 </span>
//             ),
//         };
//     }
// };
















return (
    <div>
        <h1 className="logOffMsg">You have successfully logged off!</h1>
        <img src="https://cdn.worldvectorlogo.com/logos/metamask.svg" id="metamask-img" alt="Your very own NFT Wallet" className="metamask-img">
          </img>
    </div>
)

};

export default LogOff;

