import React from 'react'
import "./AssetMetadata.css";
import {Link} from "react-router-dom";

export default class AssetMetadata extends React.Component {
  
  scalePhoto(event){
    let height = event.target.height;
    let width = event.target.width;

    console.log(`${height} x ${width}`);

    if(height < 100 && width < 100){
      event.target.classList.add("tiny-img");
    }

    event.target.classList.add("card-image");
  }

  render() {
    const { asset } = this.props

    var assetAddr; // = asset.tokenAddress; //asset.asset_contract.address;
    var assetId; // = asset.tokenId; //asset.token_id;
    var assetContractName;
    var assetImage;

    asset.tokenAddress !== undefined
      ? assetAddr = asset.tokenAddress 
      : assetAddr = asset.asset_contract.address;
    asset.tokenId !== undefined 
      ? assetId = asset.tokenId 
      : assetId = asset.token_id;
    asset.assetContract !== undefined
      ? assetContractName = asset.assetContract.name
      : assetContractName = asset.asset_contract.name;
    asset.imageUrl !== undefined
      ? assetImage = asset.imageUrl
      : assetImage = asset.image_url

    return (
      <div className="frag">
        <div className="card-container" title={`${asset.name}, ${assetContractName}`}>
          <div className="img-container">
            <Link rel="noopener noreferrer" className="image-link text-center d-inline-block m-100" to={`/asset/${assetAddr}/${assetId}`}>
              <img
                alt="Asset artwork"
                onLoad={this.scalePhoto}
                src={assetImage} />
            </Link>
          </div>
            
          <div className="card-body h-25">
            <div className="card-text text-truncate">
              <Link rel="noopener noreferrer" to={`/asset/${assetAddr}/${assetId}`} className="card-link">
                <h4>{asset.name}</h4>
                <h5><i>{assetContractName}</i></h5>
              </Link>
            </div>
          </div>
        </div>
    </div>
    )
  }
}
