/**
 * @author Jinhao Li
 * 
 * @version 2021.06.28 - Base development
 *          2021.06.30 - Page styling
 * 
 * @since 2021.06.28
 */

import React from 'react'
import "./Home.css"
import {NavLink, Link} from "react-router-dom";

function Home() {
    return (
        <section className='homepage'>
            <div className='homepage-top'>
                <div className="homepage-top-left">
                    <h1>Discover, sell, and donate extraordinary NFTs</h1>
                    <div className='homepage-top-left-button-container'>
                        <button className='top-button-left'>
                            <NavLink as={Link} to={"/marketplace"} className="ExploreButton">
                                Explore
                            </NavLink>
                        </button>
                        <button className='top-button-right'>
                            <NavLink as={Link} to={"/create"} className="CreateButtonHome">
                                Create
                            </NavLink>
                        </button>
                    </div> 
                </div>
                <div className="homepage-top-right">
                    {/* <h3>A temporary placeholder (Tobe the most recent published nft item in the marketplace)</h3> */}
                    <img className="catImg" src={require('./cat.png')} alt="Sale Icon"/>    
                </div>
            </div>
            <div className='homepage-middle'>
                <h2>Create and sell your NFTs</h2>
                <br/>
                <div className='create-container'>
                    <div className='create-item'>
                        <img src={require('./metamask_icon.png')} width='270px' height='270px' alt="Metamask Icon"/>
                        <h4>Set up your wallet</h4>
                        <p>We only support MetaMask wallet at the moment.</p>
                    </div>
                    {/* <div className='create-item'>
                        <img src={require('./collection.jpg')} width='50px' alt="Collection Icon"/>
                        <h4>Create your collection</h4>
                        <p>Click create and set up your collection. Add social links, a description, profile & banner images, and set a secondary sales fee.</p>
                    </div> */}
                    <div className='create-item'>
                        <img src={require('./nft_icon.png')} width='270px' height='270px' alt="Sale Icon"/>
                        <h4>Add your NFTs</h4>
                        <p>Upload your work (image, video, audio, or 3D art), add a title and description, 
                            and customize your NFTs with properties, stats, and unlockable content.
                        </p>
                    </div>
                    <div className='create-item'>
                        <img src={require('./sale_icon.png')} width='270px' height='270px' alt="Sale Icon"/>
                        <h4>List them for sale</h4>
                        <p>Choose between auctions, fixed-price listings, and declining-price listings. 
                            You choose how you want to sell or donate your NFTs, and we help you to do that.
                        </p>
                    </div>
                </div>
            </div>

            <div className='homepage-bottom'>
                <h2>Browse by category</h2>
                <br/>
                <div className='browse-by-category-container'>
                    <div className='categories'>
                        <h3>Art 🎨</h3>
                        <p>Discover the world's top crypto artists</p>
                        <button className='categoryBtn'>Explore Art</button>
                    </div>
                    <div className='categories'>
                        <h3>Music 🎵</h3>
                        <p>Discover the world's top crypto mustic</p>
                        <button className='categoryBtn'>Explore Music</button>
                    </div>
                    <div className='categories'>
                        <h3>Virtual Worlds 🌐</h3>
                        <p>Buy and sell land parcels and wearables from projects
                            like Decentraland, Cryptovoxels and Somnium Space.
                        </p>
                        <button className='categoryBtn'>Explore Virtual Worlds</button>
                    </div>
                    <div className='categories'>
                        <h3>Sports 🏀</h3>
                        <p>Browse, buy, and sell non-fungible tokens from the world's top
                            sporting brands in golf, football, auto, racing, and more.
                        </p>
                        <button className='categoryBtn'>Explore Sports</button>
                    </div>
                    <div className='categories'>
                        <h3>Collectibles 🎁</h3>
                        <p>Kittens, punks, and memes are being traded through digital wallets. 
                            Own, sell, and donate rare NFTs like CryptoKittes, Axie Infinity, and more.
                        </p>
                        <button className='categoryBtn'>Explore Collectibles</button>
                    </div> 
                    <div className='categories'>
                        <h3>All NFTs 💹</h3>
                        <p>Just want to explore, browse, and discover the endless possibilites of NFTs?
                            Browse all categories
                        </p>
                        <button className='categoryBtn'>Explore All NFTs</button>
                    </div>
                </div>
            </div>
        </section>
        
    )
}

export default Home
