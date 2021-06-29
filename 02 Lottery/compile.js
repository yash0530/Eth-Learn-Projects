const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf-8');

const input = {
    language: 'Solidity',
    sources: {
        contract: {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [
                    "abi",
                    "evm.bytecode.object"
                ]
            }
        }
    }
};

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts.contract.Lottery;