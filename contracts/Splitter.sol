//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Splitter is Ownable {
    event Received(address from, uint256 amount);

    address private immutable _withdrawalAddress1;
    address private immutable _withdrawalAddress2;

    uint256 private immutable _addr1Percentage;

    constructor(
        address addr1_,
        address addr2_,
        uint256 addr1Percentage_
    ) {
        _withdrawalAddress1 = addr1_;
        _withdrawalAddress2 = addr2_;
        _addr1Percentage = addr1Percentage_;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    modifier onlyWithdrawalAddresses() {
        require(
            msg.sender == owner() ||
                msg.sender == _withdrawalAddress1 ||
                msg.sender == _withdrawalAddress2,
            "Caller cannot withdraw funds"
        );
        _;
    }

    /// @notice Withdraw contract's ETH balance to withdrawal addresses
    function withdrawETH() external onlyWithdrawalAddresses {
        uint256 _balance = address(this).balance;
        require(_balance > 0, "No balance to transfer");

        uint256 _amount1 = (_balance * _addr1Percentage) / 100;

        payable(_withdrawalAddress1).transfer(_amount1);
        payable(_withdrawalAddress2).transfer(_balance - _amount1);
    }

    /// @notice Withdraw contract's ERC20 balance to withdrawal addresses
    function withdrawERC20(address erc20) external onlyWithdrawalAddresses {
        IERC20 token = IERC20(erc20);
        uint256 _balance = token.balanceOf(address(this));
        require(_balance > 0, "No balance to transfer");

        uint256 _amount1 = (_balance * _addr1Percentage) / 100;

        token.transfer(_withdrawalAddress1, _amount1);
        token.transfer(_withdrawalAddress2, _balance - _amount1);
    }
}
