from brownie import (
    network,
    accounts,
    config,
    MockV3Aggregator,
    LinkToken,
    VRFCoordinatorMock,
    Contract,
)

FORKED_LOCAL_ENVIRONMENTS = ["mainnet-fork"]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local"]
DECIMALS = 8
INITIAL_VALUE = 200000000000

CONTRACT_TO_MOCK = {
    "eth_usd_price_feed": MockV3Aggregator,
    "vrf_coordinator": VRFCoordinatorMock,
    "link_token": LinkToken,
}


def get_account(index=None, id=None):

    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        return accounts[0]
    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if network.show_active() in FORKED_LOCAL_ENVIRONMENTS:
        return accounts[0]

    return accounts.add(config["wallets"]["from_key"])


def get_contract(contract_name):
    """
    This function will grab the contract addresses from the brownie config
    if defined, otherwise, it will deploy a mock version of that contract, and
    return that mock contract.
        Args:
            contract_name (string)
        Returns:
            brownie.network.contract.ProjectContract: The most recently deployed
            version of this contract.
    """
    contract_type = CONTRACT_TO_MOCK[contract_name]

    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        if len(contract_type) <= 0:
            deploy_mocks()
        contract = contract_type[-1]
    else:
        contract_address = config["networks"][network.show_active()][contract_name]
        contract = Contract.from_abi(
            contract_type._name, contract_address, contract_type.abi
        )
    return contract


def deploy_mocks(decimals=DECIMALS, initial_value=INITIAL_VALUE):
    account = get_account()
    MockV3Aggregator.deploy(decimals, initial_value, {"from": account})
    link_token = LinkToken.deploy({"from": account})
    VRFCoordinatorMock.deploy(link_token.address, {"from": account})
    print("Deployed Mocks!")


def fund_with_link(
    contract_address, account=None, link_token=None, amount=1000_0000_00000_00000
):
    account = account if account else get_account()
    link_token = link_token if link_token else get_contract("link_token")
    txn = link_token.transfer(contract_address, amount, {"from": account})
    txn.wait(1)
    print("Funded contract!")
    return txn
