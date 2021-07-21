/**
 * @author Ethan Sengsavang
 *
 * @version 2021.07.20 - Base development
 * @since 2021.07.20
 */

import React from "react";
import "./DefiLink.css";
import coinImage from "./coin_isolated.png";
import boxImage from "./box_isolated.png";

const DefiLink = () => {
  return(
    <div className="DefiLinkPage">
      <div className="defiTextContainer">
        <h1>Link to DeFi Page</h1>
        <a href="https://bcharityecssen.netlify.app" target="_blank">
          <p>Support our token!</p>
        </a>
      </div>
    </div>
  )
}

export default DefiLink;
