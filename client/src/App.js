import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import OwnershipContract from "./contracts/Auction.json";
import "./App.css";
import TextField from '@material-ui/core/TextField';

class App extends Component {

	state = { bidId: null, minAmt: null, bidName: null, totBids: [], topBids: [], price: null, winnerID: null }

	constructor(props) {
		super(props)

		this.sendCreateAuc = this.sendCreateAuc.bind(this);
		this.sendBidAmt = this.sendBidAmt.bind(this);
		this.sendFinalize = this.sendFinalize.bind(this);
		this.sendResult = this.sendResult.bind(this);
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
			instance.address = "0xc6024152dfa7b37daf7d1581e271a7effad70e19";
			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			this.setState({ web3, accounts, contract: instance });

		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`,
			);
			console.error(error);
		}
	};

	createAuc = async () => {
		const { contract, accounts, bidId, minAmt, bidName } = this.state;
		await contract.methods.createAuc(bidId, minAmt, bidName).send({ from: accounts[0] });
	};

	submitBid = async () => {
		const { contract, accounts, price, bidId } = this.state;
		await contract.methods.submitBid(bidId).send({ from: accounts[0], value: price * 1000000000000000000});
	};

	finalize = async () => {
		const { contract, accounts, bidId } = this.state;
		await contract.methods.finalize(bidId).send({ from: accounts[0]});
	}

	getResult = async () => {
		const { contract, bidId } = this.state;
		const response =  await contract.methods.getMaxBid(bidId).call();
		this.setState({price: response[0]._hex, winnerID: response[1]})
	}

	sendBidAmt(event) {
		event.preventDefault();
		this.setState(this.submitBid);
	}

	sendFinalize(event) {
		event.preventDefault();
		this.setState(this.finalize)
	}
	
	sendCreateAuc(event) {
		event.preventDefault();
		this.setState(this.createAuc)
	}
	
	sendResult(event) {
		event.preventDefault();
		this.setState(this.getResult)
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
				<p><strong>My Address: </strong>{this.state.accounts[0]}</p>

				<div>
					<form class='form' onSubmit={this.sendCreateAuc}>
						<h2>Create Acution</h2>
						<TextField type='text' label='Bid Id' onInput={e => this.setState({ bidId: e.target.value })} />
						<TextField type='text' label='Bid Name' onInput={e => this.setState({ bidName: e.target.value })} />
						<TextField type='text' label='Min Amount' onInput={e => this.setState({ minAmt: e.target.value })} />
						<button className="button"> Create Bid </button>
					</form>
				</div>
				
				<div>
					<form class='form' onSubmit={this.sendBidAmt}>
						<h2>Submit Bid</h2>
						<TextField type='text' label='Bid Id' onInput={e => this.setState({ bidId: e.target.value })} />
						<TextField type='text' label='Your Bid' onInput={e => this.setState({ price: e.target.value })} />
						<button className="button"> Submit your Bid </button>
					</form>
				</div>
				
				<div>
					<form class='form' onSubmit={this.sendFinalize}>
						<h2>Finalize Bid</h2>
						<TextField type='text' label='Bid Id' onInput={e => this.setState({ bidId: e.target.value })} />
						<button className="button"> Finalize Bid </button>
					</form>
				</div>

				<div>
					<form class='form' onSubmit={this.sendResult}>
						<h2>Get Bid Result</h2>
						<TextField type='text' label='Bid Id' onInput={e => this.setState({ bidId: e.target.value })} />
						<button className="button"> Get Bid Result </button>
						<p>Bid Amount : {this.state.price}</p>
						<p>Winner : {this.state.winnerID}</p>
					</form>
				</div>
				
			</div>
		);
	}
}
export default App;
