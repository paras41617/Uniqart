import React from 'react';
import { ethers } from 'ethers';
import NFT from '../abis/NFT.json';
import Market from '../abis/Market.json';
import { nft_address, market_address } from '../config';
import axios from 'axios';
import Web3Modal from "web3modal"
import Popup from './Popup';

class My_nfts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nfts: [],
            loading_state: 'not_loaded',
            showPopup: false,
            type: ''
        }
        this.togglePopup = this.togglePopup.bind(this);
        this.load_nfts = this.load_nfts.bind(this);
    }

    componentDidMount() {
        this.load_nfts();
    }

    togglePopup(type , i) {
        this.setState({ single_element: this.state.nfts[i] });
        this.setState({
            showPopup: !this.state.showPopup,
            type: type
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
                likes : i.likes.toString(),
                transfers : i.no_of_transfers.toString(),
                seller:i.seller,
                mintedby:i.mintedby,
                sale:i.on_sale
            }
            return item
        }))
        this.setState({ nfts: items, loading_state: 'loaded' });
    };

    render() {
        return (
            <div>
                <div id='explore_1'>
                    My NFT
                </div>
                {this.state.nfts.length == 0 ?<h1 id="no_nft">No NFT Yet</h1> :null}
                <div>
                    <p>&nbsp;</p>
                </div>
                <div className='grid_container_2_explore'>
                    {
                        this.state.nfts.map((nft, i) => (
                            <div key={i} className="card_2_explore">
                                <button onClick={() => this.togglePopup("my_nfts",i)} id="close">
                                    <img className='image_2_explore' src={nft.image} placeholder='random_picture' />
                                    <div className="container_2_explore">
                                        <h4><b>{nft.name}</b></h4>
                                        <p>{nft.price}</p>
                                    </div>
                                </button>
                            </div>
                        ))
                    }
                </div>
                <div>
                    {this.state.showPopup ?
                        <Popup
                            type="my_nfts"
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

export default My_nfts;
