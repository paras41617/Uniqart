import React from 'react';
import '../css/Popup.css'
import { ethers } from 'ethers';
import NFT from '../abis/NFT.json';
import Market from '../abis/Market.json';
import { nft_address, market_address } from '../config';
import axios from 'axios';
import Web3Modal from "web3modal"

class Popup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            amount: '',
            showPopup: false,
            status_current: "",
            button: "",
            can_like: "",
            change:false
        }
        this.buyNft = this.buyNft.bind(this);
        this.load_account = this.load_account.bind(this);
        this.resell_nft = this.resell_nft.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.onChange = this.onChange.bind(this);
        this.check_status = this.check_status.bind(this);
        this.button_status = this.button_status.bind(this);
        this.check_can_like = this.check_can_like.bind(this);
        this.do_like = this.do_like.bind(this);
        this.remove = this.remove.bind(this);
        this.change_call = this.change_call.bind(this);
    }

    change_call(){
        this.setState({change:true});
        this.togglePopup();
    }

    async change_price(given) { 
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        let contract = new ethers.Contract(nft_address, NFT.abi, signer)
        const price = ethers.utils.parseUnits(given, 'ether')
        contract = new ethers.Contract(market_address, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()
        let transaction = await contract.change_price(this.props.nft.tokenId, price, { value: listingPrice })
        await transaction.wait()
        window.location.reload();
    }

    async remove() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        let contract = new ethers.Contract(nft_address, NFT.abi, signer)
        contract = new ethers.Contract(market_address, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()
        let transaction = await contract.remove_nft(nft_address, this.props.nft.tokenId, { value: listingPrice })
        await transaction.wait();
        window.location.reload();
    }

    async check_can_like() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const market_contract = new ethers.Contract(market_address, Market.abi, provider);
        const data = await market_contract.check_likes(this.props.nft.tokenId, this.state.account);
        if (data == 0) {
            this.setState({ can_like: true });
        }
        else {
            this.setState({ can_like: false });
        }
    }

    check_status() {
        let ans = "";
        if ((this.props.nft.owner.toUpperCase() == this.state.account || this.props.nft.owner == "0x0000000000000000000000000000000000000000") && (this.props.nft.mintedby.toUpperCase() == this.state.account)) {
            ans = " On Sale";
        }
        else if ((this.props.nft.owner.toUpperCase() == this.state.account) && (this.props.nft.mintedby.toUpperCase() != this.state.account)) {
            if (this.props.nft.sale == true) {
                ans = " Purchased on Sale"
            }
            else {
                ans = " Purchased not on sale"
            }
        }
        else if ((this.props.nft.owner.toUpperCase() != this.state.account) && (this.props.nft.mintedby.toUpperCase() == this.state.account)) {
            if (this.props.nft.sale == true) {
                if (this.props.type == "my_nfts") {
                    ans = " Sold"
                }
                else {
                    ans = " On Sale"
                }
            }
            else {
                ans = " Sold"
            }
        }
        else {
            ans = " On Sale";
        }
        this.setState({ status_current: ans });
        this.button_status();
    }

    button_status() {
        let ans = "";
        if ((this.props.nft.owner.toUpperCase() == this.state.account || this.props.nft.owner == "0x0000000000000000000000000000000000000000") && (this.props.nft.mintedby.toUpperCase() == this.state.account)) {
            ans = null;
        }
        else if ((this.props.nft.owner.toUpperCase() == this.state.account) && (this.props.nft.mintedby.toUpperCase() != this.state.account)) {
            if (this.props.nft.sale == true) {
                ans = null;
            }
            else {
                ans = "sell";
            }
        }
        else if ((this.props.nft.owner.toUpperCase() != this.state.account) && (this.props.nft.mintedby.toUpperCase() == this.state.account)) {
            if (this.props.nft.sale == true) {
                ans = "buy"
            }
            else {
                ans = null
            }
        }
        else {
            ans = "buy";
        }
        this.setState({ button: ans });
        this.check_can_like();
    }

    async do_like() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(market_address, Market.abi, signer)
        const transaction = await contract.increase_likes(this.props.nft.tokenId, this.state.account);
        await transaction.wait()
        window.location.reload();
    }

    async onChange(e) {
        const text = await e.target.value;
        this.setState({ [e.target.name]: text });
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup,
        });
    };

    async resell_nft() {
        this.togglePopup();
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        let contract = new ethers.Contract(nft_address, NFT.abi, signer)
        const price = ethers.utils.parseUnits(this.state.price, 'ether')
        contract = new ethers.Contract(market_address, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()
        let transaction = await contract.sell_nft(nft_address, this.props.nft.tokenId, price, { value: listingPrice })
        await transaction.wait();
        window.location.reload();
    }

    async load_account() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.setState({ account: accounts[0].toUpperCase() });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const ethbalance = await provider.getBalance(accounts[0]);
        this.setState({
            amount: ethers.utils.formatEther(ethbalance),
        });
        this.check_status();
    }

    componentDidMount() {
        this.load_account();
    }

    async buyNft(nft) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(market_address, Market.abi, signer)
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        const transaction = await contract.createMarketSale(nft_address, nft.tokenId, {
            value: price
        })
        await transaction.wait()
        window.location.reload();
    }

    render() {
        return (
            <div>
                <div class="modal_container">
                    {this.state.showPopup ? <div class="form_2">
                        <div class="title">Market</div>
                        <div class="subtitle">Price for your NFT</div>
                        <div class="input-container ic2">
                            <input onChange={this.onChange} id="price" name="price" class="input" type="number" placeholder=" " />
                            <div class="cut"></div>
                            <label for="price" class="placeholder">Price</label>
                        </div>
                        <button onClick={this.state.change?()=>this.change_price(this.state.price):this.resell_nft} type="text" class="submit_2">List</button>
                    </div> : this.props.type == "account" ? <div class="form_2">
                        <div class="title_2">Account</div>
                        <div class="subtitle_2">Address : </div>
                        <div class="subtitle_2">{this.state.account}</div>
                        <div class="subtitle_2">Amount : </div>
                        <div class="subtitle_2">{this.state.amount}</div>
                        <button onClick={this.props.closePopup} type="text" class="submit_2">Close</button>
                    </div> : this.props.type == "all" || this.props.type == "my_nfts" || this.props.type == "my_purchases" ? <div class="modal_card">
                        <div class="card-header">
                            <img src={this.props.nft.image} alt="rover" />
                        </div>
                        <div class="card-body">
                            <div className='parallel_2'>
                                <span class="tag tag-teal">Collection : {this.props.nft.collection}</span>
                                {this.state.can_like ? null : <span class="tag_2 tag-teal_2">Liked</span>}
                                <button onClick={this.state.can_like == 0?() => this.do_like:null} id={this.state.can_like ? "child_2" : "child"} class={this.state.can_like ? "like__btn" : "like__btn_2"}>
                                    <span id="icon"><i class="far fa-thumbs-up material-icons">thumb_up</i></span>
                                </button>
                            </div>
                            <div className='parallel'>
                                <div>
                                    <h4 className='flex'>
                                        Name : {this.props.nft.name}
                                    </h4>
                                    <h4 className='flex'>
                                        Price : {this.props.nft.price}
                                    </h4>
                                    <h4 className='flex'>
                                        Number of Transfers : {this.props.nft.transfers}
                                    </h4>
                                </div>
                                <div>
                                    <h4 className='flex'>
                                        Likes : {this.props.nft.likes}
                                    </h4>
                                    <h4 className='flex'>
                                        Description : {this.props.nft.about}
                                    </h4>
                                    <h4 className='flex'>
                                        Status :
                                        {this.state.status_current}
                                    </h4>
                                </div>
                            </div>
                            <div id='buttons'>
                                {this.props.type == "all" ?this.state.button != null ? this.state.button == "buy" ? this.props.type == "all" ? <button onClick={() => this.buyNft(this.props.nft)} class="button-27">Buy</button> : null : <button onClick={this.togglePopup} class="button-27">Sell</button> : null:null}
                                <div>
                                    &nbsp;
                                </div>
                                <div>
                                    &nbsp;
                                </div>
                                <div>
                                    &nbsp;
                                </div>
                                {this.props.type == "all" ?null:this.props.nft.owner.toUpperCase() == this.state.account || (this.props.nft.owner == "0x0000000000000000000000000000000000000000" && this.props.nft.mintedby.toUpperCase() == this.state.account) ? this.props.nft.sale == true ? <button onClick={this.remove} class="button-27">Remove</button> : <button onClick={this.togglePopup} class="button-27">Sell</button> : null}
                                {this.props.nft.owner.toUpperCase() == this.state.account || (this.props.nft.owner == "0x0000000000000000000000000000000000000000" && this.props.nft.mintedby.toUpperCase() == this.state.account) ? <button onClick={this.change_call} class="button-27">Change</button> : null}
                                <button onClick={this.props.closePopup} class="button-27">Close</button>
                            </div>
                        </div>
                    </div> : null}
                </div>
            </div>
        )
    }
}

export default Popup;
