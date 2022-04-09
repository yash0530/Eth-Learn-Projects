## Running script

- Deploying on Rinkeby
- brownie run scripts/deploy.py --network rinkeby

- Deploying on Ganache-CLI
- brownie run scripts/deploy.py

- Deploying on Persistent Ganache-UI
- Start Ganache UI
- brownie run scripts/deploy.py --network ganache-local

## Working with networks

- brownie networks list
- brownie networks add Ethereum ganache-local host=http://0.0.0.0.8545 chainid=1337

## Testing

- brownie test
- brownie test -k test_only_owner_can_withdraw
- brownie test --network rinkeby
