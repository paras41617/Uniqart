import React from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import NFT from '../abis/NFT.json';
import Market from '../abis/Market.json';
import { nft_address, market_address } from '../config';
import { create as ipfs } from 'ipfs-http-client';

const client = new ipfs({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

class Create_item extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file_url: null,
      price: '',
      name: '',
      description: '',
      url_total:''
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
    const description = this.state.description;
    const data = JSON.stringify({
      name, description, image: file_url
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
    transaction = await contract.createMarketItem(nft_address, tokenId, price , { value: listingPrice })
    await transaction.wait()
  }

  render() {
    return (
      <div>
        <input onChange={this.onChange} name='name' type='text' />
        <input onChange={this.onChange} name='price' type='number' />
        <input onChange={this.onChange} name='description' type='text' />
        <input onChange={this.onChange_file} name='file' type='file' />
        <button onClick={this.createMarket} >submit</button>
      </div>
    )
  }
}

export default Create_item;