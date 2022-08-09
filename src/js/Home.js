import React from 'react';
import '../css/Home.css'
import { ethers } from 'ethers';
import NFT from '../abis/NFT.json';
import Market from '../abis/Market.json';
import { nft_address, market_address } from '../config';
import axios from 'axios';
import Web3Modal from "web3modal";
import { Link } from 'react-router-dom';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nfts: [],
            loading_state: 'not_loaded',
            random: null,
            random_load: false,
            random_nfts: [],
            random_nfts_load: false
        }
        this.load_nfts = this.load_nfts.bind(this);
        this.random_nft = this.random_nft.bind(this);
        this.random_nfts = this.random_nfts.bind(this);
    }

    async random_nft() {
        let number = Math.floor((Math.random() * this.state.nfts.length) + 0);
        let get = this.state.nfts[number];
        this.setState({ random: get });
        this.setState({ random_load: true });
        this.random_nfts();
    }

    async random_nfts() {
        if (this.state.nfts.length > 0) {
            const temp = [];
            for (let i = 0; i < 4; i++) {
                let number = Math.floor((Math.random() * this.state.nfts.length) + 0);
                let get = this.state.nfts[number];
                temp.push(get);
            }
            this.setState({ random_nfts: temp });
            this.setState({ random_nfts_load: true });
        }
    }

    async load_nfts() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const token_contract = new ethers.Contract(nft_address, NFT.abi, provider);
        const market_contract = new ethers.Contract(market_address, Market.abi, provider);
        const data = await market_contract.fetchMarketItems();
        const items = await Promise.all(data.map(async i => {
            const token_uri = await token_contract.tokenURI(i.tokenId)
            const meta = await axios.get(token_uri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                about: meta.data.about,
                collection: meta.data.collection,
            }
            return item
        }))
        this.setState({ nfts: items, loading_state: 'loaded' });
        this.random_nft();
    };

    componentDidMount() {
        this.load_nfts();
    }

    render() {
        return (
            <div>
                <div id='home_first_section'>
                    <div id='home_first_section_text'>
                        <div>
                            Dive into the world of NFTs
                        </div>
                        <div>
                            &nbsp;
                        </div>
                        <button onClick={event => window.location.href = '/explore'}
                            id='button_1'>Dive</button>
                    </div>
                    {this.state.random_load ? <div className="grid-container">
                        <div className="card">
                            <a>
                                <img id='img_first' src={this.state.random.image} placeholder='random_picture' />
                                <div className="container">
                                    <h4><b>{this.state.random.name}</b></h4>
                                    <p>{this.state.random.price}</p>
                                </div>
                            </a>
                        </div>
                    </div> : null}
                </div>
                <div className='second_section_grid-container' id='home_second_section'>

                    <ul className="tilesWrap">
                        <li>
                            <h2>01</h2>
                            <p>
                                Explore various NFT
                            </p>
                            <button><Link to="/about">Read More</Link></button>
                        </li>
                        <li>
                            <h2>02</h2>
                            <p>
                                Create Your own NFT
                            </p>
                            <button><Link to="/about">Read More</Link></button>
                        </li>
                        <li>
                            <h2>03</h2>
                            <p>
                                Live Auction
                            </p>
                            <button><Link to="/about">Read More</Link></button>
                        </li>
                        <li>
                            <h2>04</h2>
                            <p>
                                Like and Appreciate others
                            </p>
                            <button><Link to="/about">Read More</Link></button>
                        </li>
                    </ul>
                </div>
                <div>
                    <div className='grid_container_2'>
                        {
                            this.state.random_nfts.map((nft, i) => (
                                <div key={i} className="card_2">
                                    <a>
                                        <img className='image_2' src={nft.image} placeholder='random_picture' />
                                        <div className="container_2">
                                            <h4><b>{nft.name}</b></h4>
                                            <p>{nft.price}</p>
                                        </div>
                                    </a>
                                </div>
                            ))
                        }
                    </div>
                    <button onClick={event => window.location.href = '/explore'}
                        id='button_2'>Dive</button>
                </div>
            </div>
        )
    }
}

export default Home;