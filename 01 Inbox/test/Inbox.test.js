const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { abi, evm } = require('../compile');

const web3 = new Web3(ganache.provider());

let accounts;
let inbox;

beforeEach(async () => {
    // get unlocked accounts
    accounts = await web3.eth.getAccounts();

    // deploy contract
    inbox = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object, arguments: ["Hi there!"] })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.strictEqual(message, "Hi there!");
    });

    it('can change the message', async() => {
        await inbox.methods.setMessage('New String!!')
            .send({ from: accounts[0], gas: '1000000' });

        const message = await inbox.methods.message().call();
        assert.strictEqual(message, "New String!!");
    });
});