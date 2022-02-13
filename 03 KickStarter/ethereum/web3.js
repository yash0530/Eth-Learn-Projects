import Web3 from "web3";

let web3;
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // In the browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);
} else {
    // On the next server OR metamask not running
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/ef74396e201d4321a5e51007162699e9"
    );
    web3 = new Web3(provider);
}

export default web3;