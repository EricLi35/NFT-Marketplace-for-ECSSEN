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
import boxMaskImage from "./coin_box_mask.png";

const DefiLink = () => {
  return(
    <div className="DefiLinkPage">
      <div className="Aboutpage-header">
        <h2>This is the abuot page</h2>
      </div>

      <hr />

      <div className="links-container">
        <div className="defiTextContainer">
          <h1>Link to DeFi Page</h1>
          <a href="https://bcharityecssen.netlify.app" target="_blank" clasName="link-items">
            <p>Support our token!</p>
          </a>
        </div>

        <div className="redditLinkContainer">
          <h1>Link to Reddit</h1>
          <a href="https://www.reddit.com/r/BCharity/" target="_blank" clasName="link-items">
            <p>Connect us on Reddit!</p>
          </a>
        </div>

        <div className="mediumLinkContainer">
          <h1>Link to Medium</h1>
          <a href="https://bcharityfi.medium.com" target="_blank" clasName="link-items">
            <p>Connect us on Medium!</p>
          </a>
        </div>

        <div className="telegramLinkContainer">
          <h1>Link to Telegram</h1>
          <a href="https://t.me/BCharitynet" target="_blank" clasName="link-items">
            <p>Connect us on Telegram!</p>
          </a>
        </div>

      </div>
    </div>
  )
}

export default DefiLink;
