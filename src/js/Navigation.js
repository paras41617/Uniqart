import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navigation.css';
import { ethers } from 'ethers';

class Navigation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            signer: null,
            height: window.innerHeight,
            width: window.innerWidth,
            hamburger: 'disabled',
            search: ''
        }
        this.set_signer = this.set_signer.bind(this);
        this.resize = this.resize.bind(this);
        this.toggle_hamburger = this.toggle_hamburger.bind(this);
        this.check_accounts = this.check_accounts.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    async onChange(e) {
        const text = await e.target.value;
        this.setState({ [e.target.name]: text });
        localStorage.setItem("search", this.state.search);
    }

    async check_accounts() {
        const { ethereum } = window;
        if (ethereum) {
            var provider = new ethers.providers.Web3Provider(ethereum);
        }
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            this.setState({ signer: signer });
        }
    }

    toggle_hamburger() {
        if (this.state.hamburger == 'enabled') {
            this.setState({ hamburger: 'disabled' });
        }
        else {
            this.setState({ hamburger: 'enabled' });
        }
    }

    resize() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    componentDidMount() {
        this.check_accounts();
        localStorage.setItem("search", "");
        window.addEventListener("resize", this.resize);
    }

    componentWillUnmount() {
        window.addEventListener("resize", this.resize);
    }

    set_signer(ans) {
        this.setState({ signer: ans });
    }

    render() {
        const width = this.state.width;
        const height = this.state.height;
        return (
            <div>
                <div className='nav' >
                    <div id='nav_logo'>
                        <Link id='nav_logo' to="/">UNIQART</Link>
                    </div>
                    {width < 545 ? '' : <div className='nav_head'>
                        <Link className='nav_items_color' to="/explore">Explore</Link>
                    </div>}
                    <div id='nav_search_text'>
                        <input name='search' onChange={this.onChange} id='nav_input_search ' type='text' placeholder='Search' />
                        <div>
                            <Link to="/explore"><i id="search" class="material-icons">search</i></Link>
                        </div>
                    </div>
                    {width < 545 ? this.state.hamburger == 'enabled' ? <div id='close_menu'>
                        <i onClick={this.toggle_hamburger} class="material-icons">close</i>
                    </div> : <div id='hamburger_menu_icon'>
                        <i onClick={this.toggle_hamburger} class="material-icons">menu</i>
                    </div> : <div className='nav_head'>
                        <Link className='nav_items_color' to="/mint">Mint</Link>
                    </div>}
                    {width < 545 ? '' : <div className='nav_head'>
                        <Link className='nav_items_color' to="/about">About</Link>
                    </div>}
                    {width < 545 ? '' : <div className='nav_head'>
                        <Link className='nav_items_color' to="/ranking">Ranking</Link>
                    </div>}
                    {width < 545 ? '' : this.state.signer == null ? <div id='nav_login' className='nav_head'>
                        <Link className='nav_items_color' to="/login">Connect</Link>
                    </div> : <div id='profile_menu_icon'>
                        <Link to="/profile"><i id='profile' className="material-icons">account_circle</i></Link>
                    </div>}
                </div>
                <div>
                    {this.state.hamburger == 'enabled' && width < 545 ? <div id='hamburger_menu'>
                        <div className='hamburger_items'>
                            <Link className='nav_items_color' to="/explore">Explore</Link>
                        </div>
                        <div className='hamburger_items'>
                            <Link className='nav_items_color' to="/about">About</Link>
                        </div>
                        <div className='hamburger_items'>
                            <Link className='nav_items_color' to="/stats">Statistics</Link>
                        </div>
                        <div className='hamburger_items'>
                            <Link className='nav_items_color' to="/login">login</Link>
                        </div>
                    </div> : ''}
                </div>
            </div>
        )
    }
}

export default Navigation;