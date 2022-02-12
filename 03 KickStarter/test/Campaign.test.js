const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: 5000000 });

    await factory.methods.createCampaign('100', 'first').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] =  await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaigns', async () => {
    it('deploys campaignFactory and campaign', async () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('makes caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute money and marks them as contributors', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.contributors(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('allows manager to make a payment request', async () => {
        await campaign.methods.createRequest('need batteries', '700', accounts[2])
            .send({ from: accounts[0], gas: '1000000' });
        const requestCount = await campaign.methods.requestsCount().call();
        const request = await campaign.methods.requests(0).call();
        assert.equal(requestCount, 1);
        assert(request);
    });

    it('process requests', async () => {
        /*
         * 0: Manager => creates a request to send 5 eth to receiver
         * 1: Contributor => contributes 10 eth to campaign; approves request
         * 2: Receiver => receives 5 eth
         */

        const contributorIntial = await getBalance(accounts[1]);
        const receiverIntial = await getBalance(accounts[2]);

        // [1] contributes 10 eth to campaign
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('10', 'ether')
        });

        // [0] creates a request to send 5 eth to receiver
        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[2])
            .send({ from: accounts[0], gas: '1000000' });
        
        // [1] approves request
        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '1000000'
        });

        // [0] finalizes the request; [2] receives 5 eth
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        const contributorFinal = await getBalance(accounts[1]);
        const receiverFinal = await getBalance(accounts[2]);

        assert((contributorIntial - contributorFinal) > 9.5);
        assert((receiverFinal - receiverIntial) > 4.5);
    });
});

async function getBalance(account) {
    let balance = await web3.eth.getBalance(account);
    balance = web3.utils.fromWei(balance);
    return parseFloat(balance);
};