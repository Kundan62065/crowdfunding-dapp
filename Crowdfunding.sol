// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    address public owner;
    uint public totalFunds;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        totalFunds += msg.value;
    }

    function contribute() public payable {
        require(msg.value > 0, "Send some Ether");
        totalFunds += msg.value;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
