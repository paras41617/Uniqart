import React from 'react';
import { ethers } from 'ethers';
import NFT from '../abis/NFT.json';
import Market from '../abis/Market.json';
import { nft_address, market_address } from '../config';
import axios from 'axios';
import Web3Modal from "web3modal"
import { Link } from 'react-router-dom';
import '../css/Ranking.css'

class Ranking extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nfts: [],
            loading_state: 'not_loaded',
            rankings: []
        }
        this.load_rankings = this.load_rankings.bind(this);
        this.do_ranking = this.do_ranking.bind(this);
    }

    do_ranking() {
        this.state.nfts.sort(function (a, b) { return b.likes - a.likes });
        let rank = 1;
        let rank_value = this.state.nfts[0].likes;
        for (let i = 0; i < this.state.nfts.length; i++) {
            if (this.state.nfts[i].likes == rank_value) {
                this.state.nfts[i].ranking = rank;
            }
            else {
                rank_value = this.state.nfts[i].likes;
                rank++;
                this.state.nfts[i].ranking = rank;
            }
        }
        this.setState({ loading_state: 'loaded' });
    }

    async load_rankings() {
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
                seller: i.seller,
                image: meta.data.image,
                name: meta.data.name,
                about: meta.data.about,
                collection: meta.data.collection,
                likes: i.likes.toString(),
                transfers: i.no_of_transfers.toString(),
                mintedby: i.mintedby,
                sale: i.on_sale
            }
            return item
        }))
        this.setState({ nfts: items });
        this.do_ranking();
    }

    componentDidMount() {
        this.load_rankings();
    }

    render() {
        return (
            <div>
                <div id='ranking_1'>
                    Rankings
                </div>
                <div>
                    <p>&nbsp;</p>
                </div>
                <div>
                    {
                        this.state.nfts.map((nft, i) => (
                            <div key={i} className="card_2_ranking">
                                <button className='ranking_button' onClick={() => this.togglePopup("", i)} id="close">
                                    <div className='flex_ranking'>
                                        <img className='image_2_ranking' src={nft.image} placeholder='random_picture' />
                                        <div className="container_2_ranking">
                                            <h4><b>{"Name : " + nft.name}</b></h4>
                                            <p>{"Price : " + nft.price}</p>
                                            <p>{"Likes : " + nft.likes}</p>
                                        </div>
                                        <div class="circle">{nft.ranking}</div>
                                    </div>
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default Ranking;