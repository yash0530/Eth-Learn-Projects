from brownie import FundMe, network, config
from scripts.helpful_scripts import get_account, get_price_feed_address


def deploy_fund_me():
    account = get_account()
    price_feed_address = get_price_feed_address(account)

    fund_me = FundMe.deploy(
        price_feed_address,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify"),
    )

    print(f"Contract deployed to {fund_me.address}")
    return fund_me


def main():
    deploy_fund_me()


# Deploying on Rinkeby
# brownie run scripts/deploy.py --network rinkeby

# Deploying on Ganache-CLI
# brownie run scripts/deploy.py

# Deploying on Persistent Ganache-UI
# Start Ganache UI
# brownie run scripts/deploy.py --network ganache-local
