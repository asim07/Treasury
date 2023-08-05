# Smart Contract Treasury Integration for DeFi Protocols

This project implements a smart contract that connects a treasury to various liquidity pools and DeFi protocols, allowing for the management of funds through different platforms. The contract facilitates receiving stable coins, distributing them among protocols, swapping for different tokens, and calculating aggregated percentage yields.

## Project Description

The objective of this project is to create a smart contract that connects a treasury to multiple DeFi protocols and liquidity pools, enabling the following capabilities:

- Receiving stable coins (e.g., USDC) into the treasury smart contract.
- Dynamic distribution of funds among different liquidity pools and DeFi protocols.
- Swapping received funds for other tokens such as USDT or DAI through platforms like Uniswap.
- Interaction with the Aave protocol to deposit DAI.
- Flexible adjustment of fund distribution ratios by the contract owner post deployment.
- Calculation of the aggregated percentage yield across all integrated protocols.
- Utilization of third-party services like Beefy Finance for enhanced functionalities.

## Getting Started

Follow these steps to set up and interact with the smart contract:

1. Install project dependencies:

```npm install```


2. Launch a local Hardhat node:

``npx hardhat node --network hardhat`` its mainnet forked

3. Deploy the smart contract:

``npx hardhat deploy --network hardhat``


4. Explore the provided scripts to interact with the deployed contract and test its various features.

## Usage

The smart contract provides the following functions:

- `depositStableCoin`: Deposit stable coins into the treasury.
- `adjustDistributionRatios`: Dynamically change the allocation ratios for different protocols.
- `swapTokens`: Swap funds between stable coins and other tokens using Uniswap.
- `depositToAave`: Deposit DAI into the Aave protocol.
- `withdrawFromAave`: Withdraw DAI from the Aave protocol.
- `calculateAggregatedYield`: Calculate the combined percentage yield from all integrated protocols.

For more details on each function, refer to the contract's source code.

## Testing

Ensure the robustness of the smart contract by running the test suite:

```npx hardhat test --network hardhat```


## Bonus: Deployed Contract

The smart contract has been deployed on the Polygon Mumbai testnet. You can interact with the contract at the following address:

Deployed Contract Address: [Contract Address]

## License

This project is licensed under the [MIT License](LICENSE).

