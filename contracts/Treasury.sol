// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Interfaces/IERC20.sol";
import "./Interfaces/IUniswapRouter.sol";
import "./Interfaces/IAaveLendingPool.sol";

contract Treasury {
    address private owner;
    address private usdcTokenAddress; // USDC token contract address
    address private usdtTokenAddress; // USDT token contract address
    address private daiTokenAddress; // DAI token contract address
    address private uniswapRouterAddress; // Uniswap V2 Router contract address
    address private aaveLendingPoolAddress; // Aave LendingPool contract address

    uint256 public usdcAllocationRatio; // Allocation ratio for USDC
    uint256 public usdtAllocationRatio; // Allocation ratio for USDT
    uint256 public daiAllocationRatio; // Allocation ratio for DAI

    // Event emitted when funds are deposited
    event Deposit(address indexed from, uint256 amount, address indexed token);

    // Event emitted when funds are withdrawn
    event Withdrawal(address indexed to, uint256 amount, address indexed token);

    constructor(
        address _usdcTokenAddress,
        address _usdtTokenAddress,
        address _daiTokenAddress,
        address _uniswapRouterAddress,
        address _aaveLendingPoolAddress
    ) {
        owner = msg.sender;
        usdcTokenAddress = _usdcTokenAddress;
        usdtTokenAddress = _usdtTokenAddress;
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

    uint256 usdtAmount = (amount * usdtAllocationRatio) / 100;
    uint256 daiAmount = (amount * daiAllocationRatio) / 100;

    // IUniswapRouter uniswapRouter = IUniswapRouter(uniswapRouterAddress);

    address[] memory pathToUSDT = new address[](2);
    pathToUSDT[0] = usdcTokenAddress;
    pathToUSDT[1] = usdtTokenAddress;

    address[] memory pathToDAI = new address[](2);
    pathToDAI[0] = usdcTokenAddress;
    pathToDAI[1] = address(daiTokenAddress);

    if (usdtAmount > 0) {
        token.approve(address(uniswapRouterAddress), usdtAmount);
        IUniswapRouter(uniswapRouterAddress).swapExactTokensForTokens(
            usdtAmount,
            0,
            pathToUSDT,
            address(this)
        );
    }

    if (daiAmount > 0) {
        token.approve(address(uniswapRouterAddress), daiAmount);
        IUniswapRouter(uniswapRouterAddress).swapExactTokensForTokens(
            daiAmount,
            0,
            pathToDAI,
            address(this)
        );
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
        uint256 _usdtAllocationRatio,
        uint256 _daiAllocationRatio
    ) external onlyOwner {
        require(
            _usdcAllocationRatio + _usdtAllocationRatio + _daiAllocationRatio ==
                100,
            "Allocation ratios must add up to 100"
        );

        usdcAllocationRatio = _usdcAllocationRatio;
        usdtAllocationRatio = _usdtAllocationRatio;
        daiAllocationRatio = _daiAllocationRatio;
    }

    // Swap allocated funds between different tokens using Uniswap
    function swapTokens() external onlyOwner {
        // Similar to the previous code for swapping tokens using Uniswap
        
    }

    // Deposit tokens into Aave
    function depositToAave(uint256 amount, address tokenAddress) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        IAaveLendingPool aaveLendingPool = IAaveLendingPool(aaveLendingPoolAddress);

        token.approve(aaveLendingPoolAddress, amount);
        aaveLendingPool.deposit(tokenAddress, amount, address(this), 0);
    }

    // Withdraw tokens from Aave
    function withdrawFromAave(uint256 amount, address tokenAddress) external onlyOwner {
        IAaveLendingPool aaveLendingPool = IAaveLendingPool(aaveLendingPoolAddress);

        aaveLendingPool.withdraw(tokenAddress, amount, address(this));

        IERC20 token = IERC20(tokenAddress);
        require(
            token.transfer(owner, amount),
            "Failed to transfer tokens from Aave"
        );
    }
}
