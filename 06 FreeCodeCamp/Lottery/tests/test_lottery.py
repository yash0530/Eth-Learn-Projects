import pytest
from brownie import exceptions, accounts
from scripts.deploy_lottery import deploy_lottery
from scripts.helpful_scripts import get_account, fund_with_link, get_contract
from web3 import Web3


def test_get_entrace_fee():
    lottery = deploy_lottery()
    entrance_fee = lottery.getEntranceFee()
    assert entrance_fee == Web3.toWei(0.025, "ether")


def test_cant_enter_unless_started():
    lottery = deploy_lottery()
    with pytest.raises(exceptions.VirtualMachineError):
        lottery.enter({"from": get_account(), "value": lottery.getEntranceFee()})


def test_can_start_and_enter_lottery():
    lottery = deploy_lottery()
    account = get_account()

    lottery.startLottery({"from": account})
    lottery.enter({"from": account, "value": lottery.getEntranceFee()})

    assert lottery.players(0) == account


def test_can_end_lottery():
    lottery = deploy_lottery()
    account = get_account()

    lottery.startLottery({"from": account})
    lottery.enter({"from": account, "value": lottery.getEntranceFee()})

    fund_with_link(lottery)
    lottery.endLottery({"from": account})

    assert lottery.lottery_state() == 2  # LOTTERY_STATE.CALCULATING_WINNER


# can be considered as a integration test
def test_can_pick_winner_correctly():
    lottery = deploy_lottery()
    account = get_account()

    lottery.startLottery({"from": account})
    lottery.enter({"from": account, "value": lottery.getEntranceFee()})
    lottery.enter({"from": accounts[1], "value": lottery.getEntranceFee()})
    lottery.enter({"from": accounts[2], "value": lottery.getEntranceFee()})

    fund_with_link(lottery)
    txn = lottery.endLottery({"from": account})

    STATIC_RNG = 123
    expected_winner = accounts[STATIC_RNG % 3]
    initial_balance_winner = expected_winner.balance()
    initial_lottery_balance = lottery.balance()

    # pretend to be a chainlink and call `callBackWithRandomness` function on
    # VRFCoordinatorMock which in turn will call `fulfillRandomness` on our
    # Lottery contract with selects winner
    get_contract("vrf_coordinator").callBackWithRandomness(
        txn.events["RequestedRandomness"]["requestId"],
        STATIC_RNG,
        lottery.address,
        {"from": account},
    )
    assert lottery.recentWinner() == expected_winner
    assert lottery.balance() == 0
    assert initial_balance_winner + initial_lottery_balance == expected_winner.balance()
