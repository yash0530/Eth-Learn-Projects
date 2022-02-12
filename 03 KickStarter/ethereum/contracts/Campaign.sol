// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.5;

contract CampaignFactory {
    address[] public campaigns;
    
    function createCampaign(uint minCont, string memory name) public {
        address campaign = address(new Campaign(minCont, name, msg.sender));
        campaigns.push(campaign);
    }
    
    function getDeployedCampaigns() public view returns (address[] memory) {
        return campaigns;
    }
}

contract Campaign {
    
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approversCount;
        mapping(address => bool) approvers;
    }
    
    address public manager;
    string public name;
    uint public minContribution;
    
    uint public contributorsCount;
    mapping(address => bool) public contributors;
    
    uint public requestsCount;
    mapping(uint => Request) public requests;

    modifier restricted() {
        require(manager == msg.sender);
        _;
    }

    constructor(uint minCont, string memory _name, address creator) {
        manager = creator;
        minContribution = minCont;
        name = _name;
        requestsCount = 0;
    }
    
    function contribute() public payable {
        require(msg.value >= minContribution);
        
        contributors[msg.sender] = true;
        contributorsCount++;
    }
    
    function createRequest(string memory desc, uint val, address payable rec)
        public restricted {
        
        // Storage: Reference to an existing instance in storage
        Request storage r = requests[requestsCount++];
        r.description = desc;
        r.value = val;
        r.recipient = rec;
        r.complete = false;
        r.approversCount = 0;
    }
    
    function approveRequest(uint index) public {
        Request storage r = requests[index];
        
        require(contributors[msg.sender]);
        require(!r.approvers[msg.sender]);
        
        r.approvers[msg.sender] = true;
        r.approversCount++;
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage r = requests[index];
        
        require(!r.complete);
        require((r.approversCount * 2) >= contributorsCount);
        
        r.recipient.transfer(r.value);
        r.complete = true;
    }
}