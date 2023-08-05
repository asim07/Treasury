// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Interfaces/IERC20.sol";
import "./Interfaces/IUniswapRouter.sol";
import "./Interfaces/IAaveLendingPool.sol";

contract Treasury {
    address private owner;
    address private usdcTokenAddress; // USDC token contract address
    address private busdTokenAddress; // BUSD token contract address
    address private daiTokenAddress; // DAI token contract address
    address private uniswapRouterAddress; // Uniswap V2 Router contract address
    address private aaveLendingPoolAddress; // Aave LendingPool contract address

    uint256 public usdcAllocationRatio; // Allocation ratio for USDC
    uint256 public busdAllocationRatio; // Allocation ratio for BUSD
    uint256 public daiAllocationRatio; // Allocation ratio for DAI

    // Event emitted when funds are deposited
    event Deposit(address indexed from, uint256 amount, address indexed token);

    // Event emitted when funds are withdrawn
    event Withdrawal(address indexed to, uint256 amount, address indexed token);

    //Event emitted when ratios are updated
    event Ratios(uint256 usdc, uint256 busd, uint256 dai);

    constructor(
        address _usdcTokenAddress,
        address _busdTokenAddress,
        address _daiTokenAddress,
        address _uniswapRouterAddress,
        address _aaveLendingPoolAddress
    ) {
        owner = msg.sender;
        usdcTokenAddress = _usdcTokenAddress;
        busdTokenAddress = _busdTokenAddress;
        daiTokenAddress = _daiTokenAddress;
        uniswapRouterAddress = _uniswapRouterAddress;
        aaveLendingPoolAddress = _aaveLendingPoolAddress;
    }

    // Modifier to ensure only the owner can call certain functions
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }

    // Deposit funds into the treasury contract
    function deposit(uint256 amount) external {
        IERC20 token = IERC20(usdcTokenAddress);

        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Failed to transfer tokens"
        );

        uint256 busdAmount = (amount * busdAllocationRatio) / 100;
        uint256 daiAmount = (amount * daiAllocationRatio) / 100;

        address[] memory pathToBUSD = new address[](2);
        pathToBUSD[0] = usdcTokenAddress;
        pathToBUSD[1] = busdTokenAddress;

        address[] memory pathToDAI = new address[](2);
        pathToDAI[0] = usdcTokenAddress;
        pathToDAI[1] = address(daiTokenAddress);

        if (busdAmount > 0) {
            token.approve(address(uniswapRouterAddress), busdAmount);
            swap(pathToBUSD, busdAmount);
        }

        if (daiAmount > 0) {
            token.approve(address(uniswapRouterAddress), daiAmount);
            swap(pathToDAI, daiAmount);
        }

        emit Deposit(msg.sender, amount, usdcTokenAddress);
    }

    // Withdraw funds from the treasury contract
    function withdraw(uint256 amount, address tokenAddress) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        require(
            token.balanceOf(address(this)) >= amount,
            "Insufficient token balance"
        );

        require(
            token.transfer(msg.sender, amount),
            "Failed to transfer tokens"
        );
        emit Withdrawal(msg.sender, amount, tokenAddress);
    }

    // Set the allocation ratios for tokens
    function setAllocationRatios(
        uint256 _usdcAllocationRatio,
        uint256 _busdAllocationRatio,
        uint256 _daiAllocationRatio
    ) external onlyOwner {
        require(
            _usdcAllocationRatio + _busdAllocationRatio + _daiAllocationRatio ==
                100,
            "Allocation ratios must add up to 100"
        );

        usdcAllocationRatio = _usdcAllocationRatio;
        busdAllocationRatio = _busdAllocationRatio;
        daiAllocationRatio = _daiAllocationRatio;
        emit Ratios(
            usdcAllocationRatio,
            busdAllocationRatio,
            daiAllocationRatio
        );
    }

    // Swap allocated funds between different tokens using Uniswap
    function swap(address[] memory path, uint256 amount) private onlyOwner {
        IERC20 token = IERC20(path[0]);
        require(token.balanceOf(address(this)) >= amount, "low balance");
        token.approve(address(uniswapRouterAddress), amount);
        IUniswapRouter(uniswapRouterAddress).swapExactTokensForTokens(
            amount,
            0,
            path,
            address(this)
        );
    }

    //swap token to desired token
    function swapToken(
        address from,
        address to,
        uint256 amount
    ) external onlyOwner {
        IERC20 token = IERC20(from);
        require(token.balanceOf(address(this)) >= amount, "low balance");
                address[] memory path = new address[](2);
                path[0] = from;
                path[1]= to;
                swap(path,amount);

    }

    // Deposit tokens into Aave
    function depositToAave(
        uint256 amount,
        address tokenAddress
    ) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        IAaveLendingPool aaveLendingPool = IAaveLendingPool(
            aaveLendingPoolAddress
        );

        token.approve(aaveLendingPoolAddress, amount);
        aaveLendingPool.deposit(tokenAddress, amount, address(this), 0);
    }

    // Withdraw tokens from Aave
    function withdrawFromAave(
        uint256 amount,
        address tokenAddress
    ) external onlyOwner {
        IAaveLendingPool aaveLendingPool = IAaveLendingPool(
            aaveLendingPoolAddress
        );

        aaveLendingPool.withdraw(tokenAddress, amount, address(this));

        IERC20 token = IERC20(tokenAddress);
        require(
            token.transfer(owner, amount),
            "Failed to transfer tokens from Aave"
        );
    }
}
