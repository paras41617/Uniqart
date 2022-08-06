import React from 'react';
import '../css/Explore.css'
import { ethers } from 'ethers';
import NFT from '../abis/NFT.json';
import Market from '../abis/Market.json';
import { nft_address, market_address } from '../config';
import axios from 'axios';
import Web3Modal from "web3modal"
import Popup from './Popup';

class Explore extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nfts: [],
      loading_state: 'not_loaded',
      random: null,
      random_load: false,
      random_nfts: [],
      random_nfts_load: false,
      showPopup: false,
      single_element: null,
      search: null
    }
    this.togglePopup = this.togglePopup.bind(this);
    this.load_nfts = this.load_nfts.bind(this);
    this.random_nft = this.random_nft.bind(this);
    this.random_nfts = this.random_nfts.bind(this);
    this.do_search = this.do_search.bind(this);
  }

  togglePopup(type,i) {
    this.setState({ single_element: type == "search" ?i:this.state.nfts[i] });
    this.setState({
      showPopup: !this.state.showPopup
    });
  };

  async random_nft() {
    let number = Math.floor((Math.random() * this.state.nfts.length) + 0);
    let get = this.state.nfts[number];
    this.setState({ random: get });
    this.setState({ random_load: true });
    this.random_nfts();
  }

  async random_nfts() {
    const temp = [];
    for (let i = 0; i < 4; i++) {
      let number = Math.floor((Math.random() * this.state.nfts.length) + 0);
      let get = this.state.nfts[number];
      temp.push(get);
    }
    this.setState({ random_nfts: temp });
    this.setState({ random_nfts_load: true });
    this.do_search();
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
    this.setState({ nfts: items, loading_state: 'loaded' });
    this.random_nft();
  };

  do_search() {
    let to_search = localStorage.getItem("search");
    if (to_search != "") {
      this.state.nfts.forEach(item => {
        if (item.name === to_search || item.collection === to_search) {
          this.setState({ search: item });
        }
      });
    }
  }
  

  componentDidMount() {
    this.load_nfts();
  }

  render() {
    return (
      <div>
        {this.state.search != null ?
          <div className='grid_container_2_explore'>
            <div className="card_2_explore">
              <a>
                <img className='image_2_explore' onClick={() => this.togglePopup("search",this.state.search)} src={this.state.search.image} placeholder='random_picture' />
                <div className="container_2_explore">
                  <h4><b>{this.state.search.name}</b></h4>
                  <p>{this.state.search.price}</p>
                </div>
              </a>
            </div>
          </div> : null}
        <div id='explore_1'>
          All NFT
        </div>
        <div>
          <p>&nbsp;</p>
        </div>
        <div className='grid_container_2_explore'>
          {
            this.state.nfts.map((nft, i) => (
              <div key={i} className="card_2_explore">
                <button onClick={() => this.togglePopup("",i)} id="close">
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
              type="all"
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

export default Explore;
