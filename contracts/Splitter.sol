//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title Splitter
/// @author Nicolás Acosta - nicoacosta.eth - @0xnico_ - linktr.ee/nicoacosta.eth
/// @notice Allows a contract to receive ETH and withdraw ETH and ERC20 tokens balance to two addresses in a certain split percentage
contract Splitter is Ownable {
    /// @notice ETH was received
    /// @param from sender
    /// @param amount ETH amount received
    event ETHReceived(address from, uint256 amount);

    /// @notice Withdrawal addresses
    address private immutable _withdrawalAddress1;
    address private immutable _withdrawalAddress2;

    /// @notice percentage of balance to be withdrawn to _withdrawalAddress1
    uint256 private immutable _addr1Percentage;

    constructor(
        address addr1_,
        address addr2_,
        uint256 addr1Percentage_
    ) {
        // Set withdrawal addresses
        _withdrawalAddress1 = addr1_;
        _withdrawalAddress2 = addr2_;

        // Set _withdrawalAddress1 percentage
        _addr1Percentage = addr1Percentage_;
    }

    /// @notice Enable contract to receive ETH
    receive() external payable {
        emit ETHReceived(msg.sender, msg.value);
    }

    /// @notice Verifies if caller is authorized to withdraw funds
    modifier onlyWithdrawalAddresses() {
        require(
            msg.sender == owner() ||
                msg.sender == _withdrawalAddress1 ||
                msg.sender == _withdrawalAddress2,
            "Splitter: Caller cannot withdraw funds"
        );
        _;
    }

    /// @notice Amount to be transfered to _withdrawalAddress1
    /// @param _totalBalance Total balance to be withdrawn
    /// @return uint256 Amount to be transfered to _withdrawalAddress1
    function _withdrawalAmountForWithdrawalAddress1(uint256 _totalBalance)
        private
        view
        returns (uint256)
    {
        return (_totalBalance * _addr1Percentage) / 100;
    }

    /// @notice Withdraw contract's ETH balance to withdrawal addresses
    function withdrawETH() external onlyWithdrawalAddresses {
        uint256 _balance = address(this).balance;
        require(_balance > 0, "Splitter: No ETH balance to transfer");

        uint256 _amount1 = _withdrawalAmountForWithdrawalAddress1(_balance);

        payable(_withdrawalAddress1).transfer(_amount1);
        payable(_withdrawalAddress2).transfer(_balance - _amount1);
    }

    /// @notice Withdraw contract's ERC20 balance to withdrawal addresses
    function withdrawERC20(address erc20) external onlyWithdrawalAddresses {
        IERC20 token = IERC20(erc20);
        uint256 _balance = token.balanceOf(address(this));
        require(_balance > 0, "Splitter: No token balance to transfer");

        uint256 _amount1 = _withdrawalAmountForWithdrawalAddress1(_balance);

        token.transfer(_withdrawalAddress1, _amount1);
        token.transfer(_withdrawalAddress2, _balance - _amount1);
    }
}
