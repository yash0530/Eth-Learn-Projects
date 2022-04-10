import time
from brownie import Lottery, config, network
from scripts.helpful_scripts import get_account, get_contract, fund_with_link


def deploy_lottery():
    account = get_account(id="test-account")
    lottery = Lottery.deploy(
        get_contract("eth_usd_price_feed").address,
        get_contract("vrf_coordinator").address,
        get_contract("link_token"),
        config["networks"][network.show_active()]["fee"],
        config["networks"][network.show_active()]["keyhash"],
        {"from": account},
        publish_source=False
        # publish_source=config["networks"][network.show_active()].get("verify", False),
    )
    print("Deployed lottery!")
    return lottery


def start_lottery():
    account = get_account(id="test-account")
    lottery = Lottery[-1]
    txn = lottery.startLottery({"from": account})
    txn.wait(1)
    print("The lottery has started!")


def enter_lottery():
    account = get_account(id="test-account")
    lottery = Lottery[-1]
    value = lottery.getEntranceFee() * 1.0001
    txn = lottery.enter({"from": account, "value": value})
    txn.wait(1)
    print("Entered the lottery!")


def end_lottery():
    account = get_account(id="test-account")
    lottery = Lottery[-1]
    txn = fund_with_link(lottery.address)
    txn.wait(1)
    end_txn = lottery.endLottery({"from": account})
    end_txn.wait(1)
    time.sleep(300)
    print(f"{lottery.recentWinner()} is the new winner!!!")


def main():
    deploy_lottery()
    start_lottery()
    enter_lottery()
    end_lottery()
