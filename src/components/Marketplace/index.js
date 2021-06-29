import React from 'react';
import styled from 'styled-components';
import Log from './Log'
import "./index.css";
import { OpenSeaPort, Network } from 'opensea-js';
import Sidebar from "./Sidebar";
import { web3Provider, onNetworkUpdate, OPENSEA_JS_URL, GITHUB_URL } from '../../constants';


export default class Marketplace extends React.Component {

  state = {
    accountAddress: null
  }

  constructor(props) {
    super(props)
    this.onChangeAddress()
    onNetworkUpdate(this.onChangeAddress)
  }

  onChangeAddress = () => {
    this.seaport = new OpenSeaPort(web3Provider, {
      networkName: Network.Rinkeby
    })
    this.web3 = this.seaport.web3
    this.web3.eth.getAccounts((err, res) => {
      if(!res){
        this.state = {accountAddress: ""};

        return;
      }
      this.state = {accountAddress: res[0]};
    })
  }

  render() {
    return (
      <div>
        <header>
          <h1 className="title">
            The Ship's Log
          </h1>
          <h4 className="subtitle">
          Lorem ipsum sit amet, consectetur adipiscing elit.
          </h4>
          <h6>
            <a target="_blank" rel="noopener noreferrer" href={OPENSEA_JS_URL}>
              <img alt="OpenSea logo" className="mr-2" src="/opensea-logo.png" />OpenSea.js
            </a> example dapp
          </h6>
        </header>
        <Sidebar />
        <main>
          <Log
            seaport={this.seaport}
            accountAddress={this.state.accountAddress} />
        </main>
      </div>
    )
  }
}

