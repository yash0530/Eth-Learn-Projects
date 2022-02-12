const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');
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
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts;

fs.ensureDirSync(buildPath);
for (let contract in output.contract) {
    fs.outputJsonSync(
        path.resolve(buildPath, `${contract}.json`),
        output.contract[contract]
    );
}