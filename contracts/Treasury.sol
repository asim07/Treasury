// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to
    ) external payable returns (uint256 amounts);
}

interface IAaveLendingPool {
    function deposit(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);
}

contract Treasury is Ownable {
    using SafeERC20 for IERC20;

    IUniswapV2Router02 public uniswapRouter;
    IAaveLendingPool public aaveLendingPool;

    address public routerAddress;

    IERC20 public usdcToken;
    IERC20 public usdtToken;
    IERC20 public daiToken;

    uint256 public uniswapRatio;
    uint256 public aaveRatio;

    constructor(
        address _uniswapRouter,
        address _aaveLendingPool,
        address _usdcToken,
        address _usdtToken,
        address _daiToken
    ) {
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
        aaveLendingPool = IAaveLendingPool(_aaveLendingPool);
        usdcToken = IERC20(_usdcToken);
        usdtToken = IERC20(_usdtToken);
        daiToken = IERC20(_daiToken);
        routerAddress = _uniswapRouter;
    }

    function setRatios(
        uint256 _uniswapRatio,
        uint256 _aaveRatio
    ) external onlyOwner {
        require(_uniswapRatio + _aaveRatio == 100, "Ratios must add up to 100");
        uniswapRatio = _uniswapRatio;
        aaveRatio = _aaveRatio;
    }

    function deposit(uint256 amount) external {
        usdcToken.safeTransferFrom(msg.sender, address(this), amount);

        uint256 usdtAmount = (amount * uniswapRatio) / 100;
        uint256 daiAmount = (amount * aaveRatio) / 100;

        address[] memory path = new address[](2);
        path[0] = address(usdcToken);
        path[1] = address(usdtToken);

        usdcToken.approve(address(uniswapRouter), usdtAmount);
        IUniswapV2Router02(routerAddress).swapExactTokensForTokens(
            usdtAmount,
            0,
            path,
            address(this)
        );

        // usdcToken.approve(address(aaveLendingPool), daiAmount);
        // aaveLendingPool.deposit(
        //     address(usdcToken),
        //     daiAmount,
        //     address(this),
        //     0
        // );
    }

    function withdraw(uint256 amount) external onlyOwner {
        uint256 usdtAmount = (amount * uniswapRatio) / 100;
        uint256 daiAmount = (amount * aaveRatio) / 100;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = usdtAmount;
        amounts[1] = daiAmount;

        aaveLendingPool.withdraw(address(usdcToken), daiAmount, address(this));
        uniswapRouter.swapExactTokensForTokens(
            usdtAmount,
            0,
            getPathForTokens(address(usdtToken)),
            address(this)
        );

        usdtToken.transfer(owner(), usdtAmount);
        daiToken.transfer(owner(), daiAmount);
    }

    function calculateYield() external view returns (uint256) {
        uint256 usdtBalance = usdtToken.balanceOf(address(this));
        uint256 daiBalance = daiToken.balanceOf(address(this));

        return usdtBalance + daiBalance;
    }

    function getPathForTokens(
        address token
    ) public view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = address(token);
        path[1] = address(usdcToken);

        return path;
    }
}
