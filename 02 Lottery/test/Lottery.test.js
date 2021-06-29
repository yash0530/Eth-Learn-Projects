const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { abi, evm } = require('../compile');

const web3 = new Web3(ganache.provider());

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[0], players[0]);
        assert.strictEqual(1, players.length);
    });

    it('allows multiple account to enter', async () => {

        const count = 5;
        for (let i = 0; i < count; i++) {
            await lottery.methods.enter().send({
                from: accounts[i],
                value: web3.utils.toWei('0.02', 'ether')
            });
        }

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        for (let i = 0; i < count; i++) {
            assert.strictEqual(accounts[i], players[i]);
        }
        assert.strictEqual(count, players.length);
    });

    it('requires a min amount of eth to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 50 // very less wei
            });
            throw(false);
        } catch (err) {
            assert(err);
        }
    });

    it('only manager can call pickWinner', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.02', 'ether')
            });
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            throw(false);
        } catch (err) {
            assert(err);
        }
    })

    it('sends money to winner and resets the players', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });
        const initialBal = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        const finalBal = await web3.eth.getBalance(accounts[0]);

        const diff = finalBal - initialBal;
        assert(diff > web3.utils.toWei('1.9', 'ether'));
    })
});