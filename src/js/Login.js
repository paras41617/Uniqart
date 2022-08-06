import React, { createContext } from "react";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import '../css/Login.css';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            signer: ''
        };
        this.login_user = this.login_user.bind(this);
    }

    async login_user() {
        try {
            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()
            this.setState({ signer: signer });
            window.location.href = "/";
        }
        catch (e) {
        }
    }

    render() {
        return (
            <div id="complete_login_div" >
                <div id="login_heading" >
                    Login
                </div>
                <div id="wallet_metamask_div">
                    <img id='wallet_metamask_image' src={require('../images/metamask_image.jpg')} placeholder="image of wallet" />
                </div>
                <div id="connect_button_div">
                    <button id="connect_button" onClick={() => { this.login_user() }} >Connect to Wallet</button>
                </div>
            </div>
        )
    }
}

export default Login;