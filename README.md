# ETH and ERC20 tokens splitter

1. Deploy this contract setting two withdrawal addresses and the percentage of their split
2. Receive ETH or ERC20 tokens on this contract
3. Call `withdrawETH()` or `withdrawERC20(tokenAddress)` to withdraw to the addresses with the correct split

Great for NFT royalties
