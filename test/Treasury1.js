const { expect } = require("chai");
const { ethers } = require("hardhat");
const { contractAbi } = require('../utils/usdc-abi');

describe("Treasury", function () {
    let treasury_address;
    let treasury;
    let owner;
    let addr1;

    const uniswapRouterAddress = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
    const aaveLendingPoolAddress = "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf";
    const usdcTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const usdtTokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const USDC_WHALE = "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503"

    before(async function () {
        [owner, addr1] = await ethers.getSigners();
    });

    beforeEach(async function () {
        treasury = await ethers.deployContract("Treasury", [
            uniswapRouterAddress,
            aaveLendingPoolAddress,
            usdcTokenAddress,
            usdtTokenAddress,
            daiTokenAddress,
        ]);
        await treasury.waitForDeployment();
        treasury_address = await treasury.getAddress();
    });

    it("should set correct ratios", async function () {
        await treasury.connect(owner).setRatios(70, 30);
        expect(await treasury.uniswapRatio()).to.equal(70);
        expect(await treasury.aaveRatio()).to.equal(30);
    });

    it("should deposit and withdraw funds correctly", async function () {
        const impersonatedSigner = await ethers.getImpersonatedSigner(USDC_WHALE);
        const usdtContract = await ethers.getContractAt('IERC20', usdcTokenAddress);
        await treasury.setRatios(30, 70);

        await usdtContract.connect(impersonatedSigner).transfer(addr1, 500000000000);
        let addr1_usdc_balance = await usdtContract.balanceOf(addr1);
        console.log("usdc balance of user : ", addr1_usdc_balance);

        const depositAmount = 50000000000;
        const ownerStartingBalance = await ethers.provider.getBalance(owner);
        await usdtContract.connect(addr1).approve(treasury_address, 5000000000000);
        let contract_usdc_allowance = await usdtContract.allowance(addr1, treasury_address);

        console.log("USDC approved to treasury : ", contract_usdc_allowance);
        await treasury.connect(addr1).deposit(depositAmount);
        console.log("amount submited to treasury")

        expect(await treasury.calculateYield()).to.equal(0);

        await treasury.connect(addr1).withdraw(depositAmount);
        const ownerEndingBalance = await owner.getBalance();
        expect(ownerEndingBalance).to.be.gt(ownerStartingBalance);
    });

    it("should calculate yield correctly", async function () {
        await treasury.connect(owner).setRatios(70, 30);
        const impersonatedSigner = await ethers.getImpersonatedSigner(USDC_WHALE);
        const usdtContract = await ethers.getContractAt('IERC20', usdcTokenAddress);
        await usdtContract.connect(impersonatedSigner).transfer(addr1, 100000);
        await usdtContract.connect(addr1).approve(treasury_address, 100000000000);
        await treasury.connect(addr1).deposit(50);
        const yieldAmount = await treasury.calculateYield();
        expect(yieldAmount).to.be.gt(0);
    });
    it("return path", async function () {
        const impersonatedSigner = await ethers.getImpersonatedSigner(USDC_WHALE);
        const usdtContract = await ethers.getContractAt('IERC20', usdcTokenAddress);
        const data = await treasury.getPathForTokens(usdtTokenAddress);
        console.log(data);
    });


    // Add more test cases as needed
});
