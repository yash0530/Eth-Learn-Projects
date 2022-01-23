import web3 from './web3';
import './App.css';
import lottery from './lottery';
import React, { Component } from 'react';

class App extends Component {

	state = {
		manager: '',
		players: [],
		balance: '',
		value: '',
		message: ''
	};

	async componentDidMount() {
		const manager = await lottery.methods.manager().call();
		const players = await lottery.methods.getPlayers().call();
		const balance = await web3.eth.getBalance(lottery.options.address);

		this.setState({ manager, players, balance });
	}

	// when we use arrow function for class methods
	// the value of this is the instance of the class
	// which is normal expected behaviour for any oop lang
	onSubmit = async event => {
		event.preventDefault();

		const accounts = await web3.eth.requestAccounts();

		this.setState({ message: 'Waiting on transaction success....' });
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei(this.state.value, 'ether')
		});
		this.setState({ message: 'You have entered!!' });

		// explicitly calling life cycle method to update state
		// this method is called by default when the component renders 
		this.componentDidMount();
	}

	onClick = async event => {
		const accounts = await web3.eth.requestAccounts();

		this.setState({ message: 'Waiting on transaction success....' });
		await lottery.methods.pickWinner().send({
			from: accounts[0]
		});
		this.setState({ message: 'A winner has been picked!!' });
	
		this.componentDidMount();
	}

	render() {
		return (
			<div className="mainApp">
				<h2>Lottery Contract</h2>
				<p>This contract is managed by {this.state.manager}</p>
				<p>There are currently {this.state.players.length} players, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>
			
				<hr />
				<form onSubmit={this.onSubmit}>
					<div>
						<h4>Want to try your luck?</h4>
						<p>Minimum of 0.01 ethers is required to enter</p>
						Amount of ether to enter <input
							value={this.state.value}
							onChange={event => this.setState({ value: event.target.value })} />
					</div>
					<button>Enter</button>
				</form>
 
				<hr />
				<p>{this.state.message}</p>

				<hr />
				<h4>Pick a Winner!!</h4>
				<button onClick={this.onClick}>Pick Winner</button>

			</div>
		);
	}
};

export default App;

/** 
 * Get info from contract and render on screen steps
 * 
 * 1. Component renders
 * 2. componentDidMount is called; It is lifecycle method called when component is rendered
 * 3. 'Call' methods on contract
 * 4. set data on state
 */