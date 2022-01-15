const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { abi, evm } = require('../compile');

// Connection layer between web3 and eth network
// Here ganache provides provider for local eth network
const web3 = new Web3(ganache.provider());

let accounts;
let inbox;

// Deploy the contract to the local eth network
beforeEach(async () => {
    // get unlocked accounts
    accounts = await web3.eth.getAccounts();

    // * Since we are deploying the contract we need bytecode
    // * If we only needed to interact with deployed contract,
    // we need address of deployed contract
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
        // transaction (method call) returns transaction hash,
        // we usually don't assign it to anything
        await inbox.methods.setMessage('New String!!')
            .send({ from: accounts[0], gas: '1000000' });

        const message = await inbox.methods.message().call();
        assert.strictEqual(message, "New String!!");
    });
});