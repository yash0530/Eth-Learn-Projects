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

	onSubmit = async event => {
		event.preventDefault();

		const accounts = await web3.eth.requestAccounts();

		this.setState({ message: 'Waiting on transaction success....' });
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei(this.state.value, 'ether')
		});
		this.setState({ message: 'You have entered!!' });

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
						<p>Minimum of 0.1 ethers is required to enter</p>
						Amount of ether to enter <input
							value={this.state.value}
							onChange={event => this.setState({ value: event.target.value })}
						/>
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
