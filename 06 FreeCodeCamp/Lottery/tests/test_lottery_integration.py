import pytest
import time
from brownie import network
from scripts.helpful_scripts import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    fund_with_link,
    get_account,
)
from scripts.deploy_lottery import deploy_lottery


def test_can_pick_winner():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()

    account = get_account()
    lottery = deploy_lottery(account)

    lottery.startLottery({"from": account})
    lottery.enter({"from": account, "value": lottery.getEntranceFee() * 1.0001})
    lottery.enter({"from": account, "value": lottery.getEntranceFee() * 1.0001})

    fund_with_link(lottery)
    lottery.endLottery({"from": account})

    time.sleep(300)
    assert lottery.recentWinner() == account
    assert lottery.balance() == 0
