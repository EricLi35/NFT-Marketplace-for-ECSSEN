require("dotenv").config();
//const HDWalletProvider = require("truffle-hdwallet-provider");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = require("web3");
const fetch = require('node-fetch');
const MNEMONIC = "kitchen surprise flame reject catalog estate human brother boring they pretty tray";
const NODE_API_KEY = "44vzE8vRWWtSyAF6SJ6e99rnpmpLFOXD";
const isInfura = false;
const FACTORY_CONTRACT_ADDRESS = "0x12620d4958cb3c40159DE3Fbf2a9415e251A974D";
const NFT_CONTRACT_ADDRESS = "0x5F0ea95E05af06499B4F91a772f781816122Dd54";
const OWNER_ADDRESS = "0x6926f20dD0e6cf785052705bB39c91816a753D23";
const TO_ADDRESS = "0x11f408335E4B70459dF69390ab8948fcD51004D0";
const NETWORK = "rinkeby";
const METADATA_BASE = "givenft-metadata-api.herokuapp.com";
const NUM_CREATURES = 1;
const DEFAULT_OPTION_ID = 0;


if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address."
  );
}

const NFT_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
    ],
    name: "mintTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const FACTORY_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_optionId",
        type: "uint256",
      },
      {
        name: "_toAddress",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

var FETCH_ABI = [
    {
        "inputs": [{ "indexed": true, "name": "from", "type": "address" },
        { "indexed": true, "name": "to", "type": "address" },
        { "indexed": true, "name": "tokenId", "type": "uint256" }],
        "name": "Transfer", "type": "event"
    }
];

var testobject = {
    "name": "GiveToken mint test",
    "description": "A number made of numbers, seasoned with potato, and the sweltering heat",
    "attributes": [{ "trait_type": "file type", "value": "text" }, { "trait_type": "size", "value": "16", "display_type": "boost_number" }, { "trait_type": "Creator", "value": "potato" }],
    "image_url": "https://secure-tor-85504.herokuapp.com/images/1.png"
}

//var toAddress = TO_ADDRESS;

async function passJson(params, body) {
    var metadatabody = JSON.stringify(body);
    var tokenid = params;
    var uri = "https://" + METADATA_BASE + "/api/giveNFT/" + tokenid;

    console.log(metadatabody);

    if (tokenid === undefined) {
        console.log("token ID is undefined")
    };

    const request = {
        method: 'POST',
        body: metadatabody,
        headers: { 'Content-Type': 'application/json' },
        //credentials: 'include',
    }
    const response = await fetch(uri, request);
    console.log(response);
    return response;
};


async function getTransferInformation(token, transaction) {
    var events = await token.getPastEvents('Transfer', {
        filter: { transactionHash: transaction }
    });
    
    const tokenId = events.slice(-1)[0].returnValues.tokenId;
    return tokenId;

};

export async function mint(formbody, toAddress) {
  console.log("minting process started for a NFT to", toAddress);

  const network =
    NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "rinkeby";
  const provider = new HDWalletProvider(
    MNEMONIC,
    isInfura
      ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
      : "https://eth-" + network + ".alchemyapi.io/v2/" + NODE_API_KEY
  );
  const web3Instance = new web3(provider);

  if (FACTORY_CONTRACT_ADDRESS) {
    const factoryContract = new web3Instance.eth.Contract(
      FACTORY_ABI,
      FACTORY_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );
    const nftfetchContract = new web3Instance.eth.Contract(
      FETCH_ABI,
      NFT_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );

    // Creatures issued directly to the owner.
    for (var i = 0; i < NUM_CREATURES; i++) {
      const result = await factoryContract.methods
        .mint(DEFAULT_OPTION_ID, toAddress)
        .send({ from: OWNER_ADDRESS });
        const tokenId = await getTransferInformation(nftfetchContract, result.transactionHash);
      await passJson(tokenId, formbody);
      console.log("Minted token from factory. Transaction: " + result.transactionHash + "\ntoken ID: " + tokenId);
      provider.engine.stop();
      return result.transactionHash;
    }

  } else if (NFT_CONTRACT_ADDRESS) {
    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );
    const nftfetchContract = new web3Instance.eth.Contract(
      FETCH_ABI,
      NFT_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );

    // Creatures issued directly to the owner.
    for (var i = 0; i < NUM_CREATURES; i++) {
      const result = await nftContract.methods
        .mintTo(toAddress)
        .send({ from: OWNER_ADDRESS });
        const id = await getTransferInformation(nftfetchContract, result.transactionHash);
      await passJson(id, formbody);	
      console.log("Minted token to you. Transaction: " + result.transactionHash + "\n token ID: " + id);
      provider.engine.stop();
      return result.transactionHash;
    }
  } else {
    console.error(
      "Add NFT_CONTRACT_ADDRESS or FACTORY_CONTRACT_ADDRESS to the environment variables"
    );
    provider.engine.stop();
    return null;
  }
}

//mint(testobject);


