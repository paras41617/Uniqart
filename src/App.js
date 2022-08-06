import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Explore from './js/Explore';
import Create_item from './js/create_item';
import Navigation from './js/Navigation';
import Home from './js/Home';
import Footer from './js/Footer';
import Login from './js/Login';
import About from './js/About';
import Mint from './js/Mint';
import Profile from './js/Profile';
import My_nfts from './js/my_nfts';
import My_purchases from './js/my_purchases';
import Ranking from './js/Ranking';

class App extends React.Component {

	render() {
		return (
			<Router>
				<Navigation/>
				<Routes>
					<Route exact path="/" element={<Home/>} />
					<Route exact path="/explore" element={<Explore/>} />
					<Route exact path="/create" element={<Create_item/>} />
					<Route exact path="/login" element={<Login/>} />
					<Route exact path="/mint" element={<Mint/>} />
					<Route exact path="/about" element={<About/>} />
					<Route exact path="/profile" element={<Profile/>} />
					<Route exact path="/my_nfts" element={<My_nfts/>} />
					<Route exact path="/my_purchases" element={<My_purchases/>} />
					<Route exact path="/ranking" element={<Ranking/>} />
				</Routes>
				<Footer />
			</Router>
		);
	}
}

export default App;