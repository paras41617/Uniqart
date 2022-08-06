import React from "react";
import '../css/Mint.css'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import NFT from '../abis/NFT.json';
import Market from '../abis/Market.json';
import { nft_address, market_address } from '../config';
import { create as ipfs } from 'ipfs-http-client';

const client = new ipfs({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

class Statistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          file: null,
          price: '',
          name: '',
          about: '',
          url_total:'',
          collection:''
        };
        this.onChange = this.onChange.bind(this);
        this.onChange_file = this.onChange_file.bind(this);
        this.createMarket = this.createMarket.bind(this);
        this.createSale = this.createSale.bind(this);
    }

    async onChange_file(e) {
        const file = e.target.files[0]
        const added = await client.add(
          file
        )
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        this.setState({file_url:url});
      }
    
      async onChange(e) {
        const text = await e.target.value;
        this.setState({ [e.target.name]: text });
      }
    
      async createMarket() {
        const name = this.state.name;
        const file_url = this.state.file_url;
        const about = this.state.about;
        const collection = this.state.collection;
        const data = JSON.stringify({
          name, about, collection ,image: file_url
        })
        try {
          const added = await client.add(data)
          const url = `https://ipfs.infura.io/ipfs/${added.path}`
          this.setState({url_total:url});
          this.createSale(url)
        } catch (error) {
        }
      }
    
      async createSale(url) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)    
        const signer = provider.getSigner()    
        let contract = new ethers.Contract(nft_address, NFT.abi, signer)
        let transaction = await contract.createToken(url)
        let tx = await transaction.wait()
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
    
        const price = ethers.utils.parseUnits(this.state.price, 'ether')
        contract = new ethers.Contract(market_address, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()
        transaction = await contract.createMarketItem(nft_address, tokenId, price , 0 ,0 ,{ value: listingPrice })
        await transaction.wait()
        window.location.reload();
      }

    render() {
        return (
            <div id="mint">
                <div class="form">
                    <div class="title">Mint</div>
                    <div class="subtitle">Create your own NFT</div>
                    <div class="input-container ic1">
                        <input onChange={this.onChange} id="firstname" name="name" class="input" type="text" placeholder=" " />
                        <div class="cut"></div>
                        <label for="firstname" class="placeholder">Name</label>
                    </div>
                    <div class="input-container ic2">
                        <input onChange={this.onChange} id="price" name="price" class="input" type="number" placeholder=" " />
                        <div class="cut"></div>
                        <label for="price" class="placeholder">Price</label>
                    </div>
                    <div class="input-container ic2">
                        <input onChange={this.onChange} id="collection" name="collection" class="input" type="text" placeholder=" " />
                        <div class="cut"></div>
                        <label for="collection" class="placeholder">Collection</label>
                    </div>
                    <div class="input-container ic2">
                        <input onChange={this.onChange_file} name="file" id="file" class="input_2" type="file" placeholder=" " />
                        <div class="cut"></div>
                        <label for="file" class="placeholder">File</label>
                    </div>
                    <div class="input-container ic2">
                        <textarea onChange={this.onChange} name="about" id="about" class="input" placeholder=" "></textarea>
                        <div class="cut cut-short"></div>
                        <label for="about" class="placeholder">About</label>
                    </div>
                    <button onClick={this.createMarket} type="text" class="submit">Create</button>
                </div>
            </div>
        )
    }
}

export default Statistics;