from os import access
from brownie import network, config, accounts, MockV3Aggregator

DECIMALS = 8
STARTING_PRICE = 2000_0000_0000  # $2000
LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["ganache-local", "development"]


def get_account():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        return accounts[0]
    else:
        return accounts.add(config["wallets"]["from_key"])


def deploy_mocks(account):
    if len(MockV3Aggregator) <= 0:
        MockV3Aggregator.deploy(DECIMALS, STARTING_PRICE, {"from": account})
        print(f"Mocks Deployed")
