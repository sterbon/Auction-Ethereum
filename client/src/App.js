import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import OwnershipContract from "./contracts/Demo.json";
import "./App.css";
import TextField from '@material-ui/core/TextField';

class App extends Component {

	state = { totBids: [], topBids: [], price: null }

	constructor(props) {
		super(props)

		this.getNum = this.getNum.bind(this);
		this.sendBidAmt = this.sendBidAmt.bind(this);
		this.totBids = this.totBids.bind(this);		
	}

	componentDidMount = async () => {

		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = OwnershipContract.networks[networkId];
			const instance = new web3.eth.Contract(
				OwnershipContract.abi,
				deployedNetwork && deployedNetwork.address,
			);
			instance.address = "0x83ce02500ff42989feb847a2e2b2a5dc781f1b0e";
			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			this.setState({ web3, accounts, contract: instance });
			console.log(window.web3.getTransactionReceipt)
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`,
			);
			console.error(error);
		}
	};

	getBids = async () => {
		const { contract } = this.state;
		const response = await contract.methods.getTopBid().call();
		this.setState({ topBids : response });
		console.log(response);
	};
	
	sendBid = async () => {
		const { contract, accounts, price } = this.state;
		await contract.methods.submitBid(price).send({ from: accounts[0] });
	};

	getTotBids = async () => {
		const { contract } = this.state;
		const response = await contract.methods.getNumberOfBids().call();
		this.setState({ totBids : response._hex });
		console.log(response);
	};

	getNum(event) {
		event.preventDefault();
		this.setState(this.getBids);
	}

	sendBidAmt(event) {
		event.preventDefault();
		this.setState(this.sendBid);
	}

	totBids(event) {
		event.preventDefault();
		this.setState(this.getTotBids)
	}

	render() {
		if (!this.state.web3) {
			return (
				<div className="metamask">
					<div text-align="center">Install and login to <a href="http://www.metamask.io" target="_blank">MetaMask</a> to interact with the app! </div>
				</div>);
		}
		
		return (
			<div className="App">
				<h1> Auction on Ethereum Network </h1>
				<div>
					<form onSubmit={this.sendBidAmt}>
						<br></br>
						<TextField type='text' placeholder='Submit your price!' onInput={e => this.setState({ price: e.target.value })} />
						<button className="button"> Submit your Bid </button>
					</form>
				</div>
			
				<div>
					<form class='form' onSubmit={this.getNum}>
						<h2>Get Bid Result</h2>
						<button className="button">Get Top Bid </button>
						<p>Top Bidder : {this.state.topBids[0]}</p>
						<p>Top Bid : {parseInt(this.state.topBids[1])}</p>
					</form>
				</div>
				
				<div>
					<form onSubmit={this.totBids}>
						<button className="button">Get Total Number of Bids</button>
						<p>Total Bids : {parseInt(this.state.totBids) - 1}</p>
					</form>
				</div>
			</div>
		);
	}
}
export default App;
