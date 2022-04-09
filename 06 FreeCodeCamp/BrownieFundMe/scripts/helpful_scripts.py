from os import access
from brownie import network, config, accounts, MockV3Aggregator

DECIMALS = 8
STARTING_PRICE = 2000_0000_0000  # $2000
LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["ganache-local", "development"]
FORKED_LOCAL_ENVIROMENTS = ["mainnet-fork"]


def get_account():
    if (
        network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS
        or network.show_active() in FORKED_LOCAL_ENVIROMENTS
    ):
        return accounts[0]
    return accounts.add(config["wallets"]["from_key"])


def get_price_feed_address(account):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        return config["networks"][network.show_active()]["eth_usd_price_feed"]

    if len(MockV3Aggregator) <= 0:
        MockV3Aggregator.deploy(DECIMALS, STARTING_PRICE, {"from": account})
        print("MockV3Aggregator Deployed")
    return MockV3Aggregator[-1].address
