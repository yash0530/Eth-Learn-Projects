// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.5;

contract Lottery {
    address public manager;
    address payable[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value >= .01 ether);

        players.push(payable(msg.sender));
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encode(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted {
        require(players.length > 0);
        
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
    }

    modifier restricted() {
        require(manager == msg.sender);
        _;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
}