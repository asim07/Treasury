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

