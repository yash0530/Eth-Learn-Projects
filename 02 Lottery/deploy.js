const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');

const provider = new HDWalletProvider(
    "art void coffee frown review camera copper cycle common narrow embody favorite",
    "https://rinkeby.infura.io/v3/ef74396e201d4321a5e51007162699e9"
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(`Deploying form ${accounts[0]}`);

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ from: accounts[0], gas: '1000000' });

    console.log(`Contract deployed to ${result.options.address}`);
};
deploy();