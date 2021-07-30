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
import {Reddit, Twitter, Telegram, Medium, Instagram} from "react-bootstrap-icons";

const DefiLink = () => {
  return(
    <div className="DefiLinkPage">
      <div className="about-page-left">
        <div><h2 className='about-us-title'>About Us</h2></div>
        <div><p className='about-us-description'>BCHARITY is a community-driven decentralized open protocol that innovates a new blockchain-based tokenomics ecosystem for charitable organizations to be more transparent and accountable in their operations to the public.</p></div>
        <div><a href="https://bcharityfi.gitbook.io/bcharity/" target="_blank" className="about-page-read-more">
          Read More
        </a></div>
      </div>

      <div className="about-page-right">
        <div class="about-other-links">
          <h3 className="links-to-other-websites">Link to our other websites!</h3>
          <div className="links-container">
            <div className="defiTextContainer">
              <a href="https://bcharityecssen.netlify.app" target="_blank" className="link-items">
                <h1 className='defi-website'>DeFi Website</h1>
                <p clasasName='defi-website-description'>Support our token!</p>
              </a>
            </div>
          </div>
        </div>
        <div className="about-connect-social-medias">
          <h3 className="connect-social-medias">Connect to us on social medias!</h3>
          <div className="list-of-social-medias">
            <a href="https://www.reddit.com/r/BCharity/" target="_blank" className="social-medias">
              <Reddit />
            </a>
            <a href="https://www.reddit.com/r/BCharity/" target="_blank" className="social-medias">
              <Twitter />
            </a>
            <a href="https://www.instagram.com/bcharityofficial/" target="_blank" className="social-medias">
              <Instagram />
            </a>
            <a href="https://www.reddit.com/r/BCharity/" target="_blank" className="social-medias">
              <Telegram />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefiLink;
