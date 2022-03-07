//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Splitter {
    event Received(address, uint256);

    address private immutable _addr1;
    address private immutable _addr2;

    uint256 private immutable _percentage1;

    constructor(
        address addr1_,
        address addr2_,
        uint256 percentage1_
    ) {
        _addr1 = addr1_;
        _addr2 = addr2_;
        _percentage1 = percentage1_;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function withdraw() public {
        uint256 _balance = address(this).balance;

        require(_balance > 0, "No balance to withdraw");
        require(
            msg.sender == _addr1 || msg.sender == _addr2,
            "Caller is not authorized"
        );

        payable(_addr1).transfer((_balance * _percentage1) / 100);
        payable(_addr2).transfer((_balance * (100 - _percentage1)) / 100);
    }
}
