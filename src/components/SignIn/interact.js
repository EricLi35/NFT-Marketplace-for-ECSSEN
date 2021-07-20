// export const smartcontract;
import React from "react";

/*
This function handles the logic of loading the current message stored in the smart contract
It will make a read call to the smartcontract using Web3 API
*/
export const loadCurrentMessage = async () => {
    //const message = await oursmartContract.methods.message().call();
    //return message;
};

export const disconnectWallet = async () => {

    const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
    });
    
    const obj = {
        status: "",
        address: "",
    };
    return obj;
}

// This function will connect the user's Metamask to dApp
export const connectWallet = async () => {
    if (window.ethereum){
        try{
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            const obj = {
                status: "Write a message in the text-field above",
                address: addressArray[0],
            };
            return obj;
        } catch (err){
            return {
                address: "",
                status: "An error occured" + err.message,
            };
        }
    } else {
        return {
            address: " ",
            status: (
                <span>
                    <p>
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask in your browser
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

/* 
This function will check if an Ethereum account is already connected to the dApp on page,
Then load and update the UI accordingly
*/
export const getCurrentWalletConnected = async () => {
    if (window.ethereum){
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0){
                return {
                    address: addressArray[0],
                    status: "Write a message in the text-field above,"
                };
            } else {
                return {
                    address:"",
                    status: "Connect to Metamsk by clicking the Sign In button"
                }
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must instll Metamask, a virtual Ethereum wallet in your browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

/*
This function will update the message stored in the smart contract. It will make a write call to the smart
contract, so the user's Metamask wallet will have to sign an Ethereum transcation to update the message
*/
export const updateMessage = async (address, message) => {
    
    if (!window.ethereum || address === null){
        return {
            status: "Connect your Metamask wallet to update the message on the blockchain.",
        };
    }

    if (message.trim() === ""){
        return {
            status: "Your message cannot be an empty string.",
        };
    }
    /*
    // Set up transcation parameters
    const transcationParameters = {
        to: contractAddress, 
        from: address,
        data: oursmartContract.methods.update(message).encodeABI(),
    }; 

    // Sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transcationParameters],
        });
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" href={`https.//ropsten.etherscan.io/tx/${txHash}`}>
                    View the status of your transcation on Etherscan!
                    </a>
                    <br />
                    Once the transcation is verified by the network, the message will be updated automatically.
                </span>
            ),
        };
    } catch (error) {
        return {
            status: "😥 " + error.message,
        };
    }
    */
};
