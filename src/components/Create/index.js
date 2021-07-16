import React, {useState} from "react";
import {Plus} from "react-bootstrap-icons";
import "./index.css";
import * as Mint from "./mint";
import { getCookie, ETHERSCAN_URL } from '../../constants';
import fetch from "node-fetch";
import { v4 as uuidv4 } from 'uuid';
import ProgressBar from "../Progress_bar";

const Create = () => {  
    const [imgPreview, setImgPreview] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [error, setError] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressBg, setProgressBg] = useState("var(--blue-gradient)");
    const [transactionHash, setTransactionHash] = useState("");
    const [disableButton, setDisableButton] = useState(false);
  
    const handleImageChange = (e) => {
      e.preventDefault();
      let selected = undefined;

      if(e.target.files){
        selected = e.target.files[0];
      }

      if(selected === undefined && e.dataTransfer.items){
        if(e.dataTransfer.items[0].kind !== "file"){
          return;
        }

        selected = e.dataTransfer.items[0].getAsFile();
      }

      if(selected === undefined){
        selected = e.dataTransfer.items[0].name;
      }

      console.log(selected);
      setUploadFile(selected);

      const ALLOWED_TYPES = ["image/png" , "image/jpeg" , "image/jpg"];
      if(selected && ALLOWED_TYPES.includes(selected.type)){
        let reader = new FileReader();
        reader.onloadend = () => {
          setImgPreview(reader.result);
        }
        reader.readAsDataURL(selected);

        setError(false);
      } else {
        setError(true);
      }
    };

    async function createNFT(){
        setDisableButton(true);
        setProgress(1);

        let userData = JSON.parse(getCookie("uid"));
        let walletAddress = userData.walletAddress;

        let folderName = btoa(walletAddress.substring(0, 5) + walletAddress.substring(10, 14));
        let extension = uuidv4();

        let imageUrl = "";
        
        const xhr = new XMLHttpRequest();

        const inbody = new FormData();
        // inbody.append("file", fileData);
        inbody.append("file", uploadFile, "upload");

        console.log(inbody.getAll("file"));
      
        const address = `https://earlycelery.backendless.app/files/nft/${folderName}/${extension}`;

        xhr.onreadystatechange = () => {
          if(xhr.readyState !== 4) return;
          if(!xhr.responseText) return;
          setProgress(75);
          if(xhr.status === 400){
            console.error(JSON.parse(xhr.response));
            setProgressBg("var(--failure-color)");
            return;
          }
          let response = JSON.parse(xhr.response)
          console.log(xhr.status, response);
          imageUrl = response.fileURL;

          var NFT = {
              "name": document.getElementById("nameField").value,
              "description": document.getElementById("descriptionField").value,
              "image_url": imageUrl 
          }
          //console.log(NFT);

          let userInfo = JSON.parse(getCookie("uid"));
          let uploadPromise = Mint.mint(NFT, userInfo["walletAddress"]);

          uploadPromise.then((success) => {
            setProgress(100);

            if(success === null){
              setProgressBg("var(--failure-color)");
              return;
            }

            setProgressBg("var(--success-color)")
            console.log(success);
            setTransactionHash(success);
            setDisableButton(false);
          }).catch((err) => {
            setProgress(100)
            setProgressBg("var(--failure-color)");
            setDisableButton(false);
          });
        }

        xhr.open("POST", address);
        xhr.send(inbody);
        setProgress(50);

        // from here, image should exist within imageUrl.
        
    }

    const dragOverHandler = (evt) => {
      console.log("upload occurring");
      evt.preventDefault();
    }

    return (
      <div className="createWholePage">
      <div className = "createThing">
 
        <div className = "createNewItem_text">
            <h1>Create new item</h1>
        </div>

        <div className="file_types">
        {/* <h4> */}
        <strong className = "file_descrip">Use an image as your NFT!</strong>
        <div className="file_descrip_detailed">
        File types supported: JPG, PNG, JPEG
        </div>
        {/* </h4> */}
        </div>

      <div className="App2">
        <div className="container" onDrop={handleImageChange} onDragOver={dragOverHandler}>
          {error && <p className="errorMsg">File not supported</p>}
          <div className="imgPreview"
          style= {{background: imgPreview ? `url("${imgPreview}")no-repeat center/cover` : "transparent"}}
          >
            {!imgPreview && (
              <>
              <p></p>
              <label htmlFor="fileUpload" className="customFileUpload">
                Drag & drop file
                <div>
                  or <span className="fileTypeDescription">browse media on your device</span>
                </div>  
              </label>
              <input type="file" id="fileUpload" onChange={handleImageChange} />
              </>
            )}
          </div>
          {imgPreview && (
            <button className="removeButton" onClick={() => setImgPreview(null)}>Remove image</button>
          )}
        </div>
      </div>

      <form>
        <br></br><br></br>
        <div className = "name">
        {/* <div className = "name_text"> */}
        <strong>Name <span className="asterisk">*</span></strong> <br></br>
        {/* </div> */}

        {/* <div className = "name_textbox"> */}
        <input className="name_textbox_size" id="nameField" type="text" placeholder="Item Name"></input>
        {/* </div> */}
        
        </div>

        <br />

        <div className="tags">
          <strong>Item tags</strong>
          <p>Tags should be separated by commas (,)</p>
          <input className="name_textbox_size" type="text" placeholder="Art, Abstract, Colourful, ..." />
        </div>

        <br />
        
        {/* <h4 className = "description"> */}
        <div className = "description">
        <strong>Description</strong><br></br>

      
        <p className="description_text">
        The description will be included on the item's detail page underneath its image.
        {/*
          <span style= {{color:"blue" }} > Markdown </span>
          syntax is supported.
        */}
        </p>
        <textarea className="description_textbox" name="comment[body]" rows="1" cols="50" wrap="physical" id="descriptionField" placeholder="Provide a detailed description of your item."></textarea>

        </div>
        {/* </h4> */}

        </form>
        <div className="DonateTransactionDetails">
        {
          progress > 0
          ? <ProgressBar completed={progress} bgcolor={progressBg} />
          : <></>
        }
        {
          transactionHash !== ""
          ? <a href={`${ETHERSCAN_URL}/tx/${transactionHash}`}>View your transaction</a>
          : <p></p>
        }
        </div>
        <button className="CreateButton" onClick={() => createNFT()} disabled={disableButton}>
          <Plus className="CreatePlus" />
          <p>Create Token</p>
        </button>
    </div>
  </div>
  );
  
};

export default Create;
