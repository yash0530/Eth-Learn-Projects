const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    "art void coffee frown review camera copper cycle common narrow embody favorite",
    "https://rinkeby.infura.io/v3/ef74396e201d4321a5e51007162699e9"
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(`Deploying form ${accounts[0]}`);

    const result = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: 5000000 });

    console.log(`Contract deployed to ${result.options.address}`);
};
deploy();

// Deployed Contract
// Deploying form 0x60F548A0da1D0B5fE5317CbC26d566088bd90dC4
// Contract deployed to 0x453606d2DD392Abf6b92EA4a88ED1aCcC1B7A281