import React from 'react';
import '../css/Profile.css'
import { ethers } from 'ethers';
import NFT from '../abis/NFT.json';
import Market from '../abis/Market.json';
import { nft_address, market_address } from '../config';
import axios from 'axios';
import Web3Modal from "web3modal"
import Popup from './Popup';
import {Link} from 'react-router-dom';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nfts: [],
            loading_state: 'not_loaded',
            showPopup: false,
            type:''
        }
        this.togglePopup = this.togglePopup.bind(this);
        this.load_nfts = this.load_nfts.bind(this);
    }

    togglePopup(type) {
        this.setState({
            showPopup: !this.state.showPopup,
            type:type
        });
    };

    async load_nfts() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const market_contract = new ethers.Contract(market_address, Market.abi, signer);
        const token_contract = new ethers.Contract(nft_address, NFT.abi, provider);
        const data = await market_contract.fetchItemsCreated();
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
    };

    componentDidMount() {
        this.load_nfts();
    }

    render() {
        return (
            <div id='profile'>
                <ul className="tilesWrap_profile">
                    <li>
                        <h2>Account Details</h2>
                        <button onClick={() => this.togglePopup("account")} >View Details</button>
                    </li>
                    <li>
                        <h2>My Purchases</h2>
                        <button><Link to="/my_purchases">View Details</Link></button>
                    </li>
                    <li>
                        <h2>My NFTS</h2>
                        <button><Link to="/my_nfts">View Details</Link></button>
                    </li>
                </ul>
                <div>
                    {this.state.showPopup ?
                        <Popup
                            type={this.state.type}
                            nft={this.state.single_element}
                            closePopup={this.togglePopup}
                        />
                        : null
                    }
                </div>
            </div>
        )
    }
}

export default Profile;