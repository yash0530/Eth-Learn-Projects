// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.5;

contract Inbox {
    string public message;
    
    constructor(string memory intialMessage) {
        message = intialMessage;
    }
    
    function setMessage(string memory newMessage) public {
        message = newMessage;
    }
    
    function getMessage()  external view returns (string memory) {
        return message;
    }
}