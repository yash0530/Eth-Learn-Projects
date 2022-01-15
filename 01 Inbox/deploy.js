const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');

// * Truffle connects to Infura API
// * Infura API connects to Infura Node
// * Which is part of eth network
// * You can also setup an eth node on local and connect to it and skip infura
// * But for starters it is just easier
const provider = new HDWalletProvider(
    "art void coffee frown review camera copper cycle common narrow embody favorite",
    "https://rinkeby.infura.io/v3/ef74396e201d4321a5e51007162699e9"
);
const web3 = new Web3(provider);

// only reason why we created deploy function because we want to use async await
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log(`Deploying form ${accounts[0]}`);
    const result = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object, arguments: ["Hi there!"] })
        .send({ from: accounts[0], gas: '1000000' });

    console.log(`Contract deployed to ${result.options.address}`);
};
deploy();

// Example deployment
// Deploying form 0x60F548A0da1D0B5fE5317CbC26d566088bd90dC4
// Contract deployed to 0x31B5dd331045e7d5a11F7c6F5F80baaE60371f29