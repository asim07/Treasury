const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("Treasury", function () {
    let treasury_address;
    let treasury;
    let owner;
    let addr1;

    const uniswapRouterAddress = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
    const aaveLendingPoolAddress = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
    const usdcTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const usdtTokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";


    const USDC_WHALE = "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503";

    before(async function () {
        [owner, addr1] = await ethers.getSigners();
    });

    beforeEach(async function () {
        treasury = await ethers.deployContract("Treasury", [
            usdcTokenAddress,
            usdtTokenAddress,
            daiTokenAddress,
            uniswapRouterAddress,
            aaveLendingPoolAddress,
        ]);
        await treasury.waitForDeployment();
        treasury_address = await treasury.getAddress();
        // console.log("contract deployed : ",treasury_address);
    });

    it("should set correct ratios", async function () {
        await treasury.connect(owner).setAllocationRatios(30,30,40);
        expect(await treasury.usdcAllocationRatio()).to.equal(30);
        expect(await treasury.usdtAllocationRatio()).to.equal(30);
        expect(await treasury.daiAllocationRatio()).to.equal(40);
    });

    it("should deposit USDC  and withdraw funds correctly according to ratio", async function () {
        const usd_whale = await ethers.getImpersonatedSigner(USDC_WHALE);
        // const usdt_whale = await ethers.getImpersonatedSigner(USDC_WHALE);
        // const dai_whale = await ethers.getImpersonatedSigner(USDC_WHALE);

        const usdcContract = await ethers.getContractAt('IERC20', usdcTokenAddress);
        const usdtContract = await ethers.getContractAt('IERC20', usdtTokenAddress);
        const daiContract = await ethers.getContractAt('IERC20', daiTokenAddress);


        await treasury.setAllocationRatios(30,30,40);
        const amount = ethers.parseUnits('50000',6);
        await usdcContract.connect(usd_whale).transfer(addr1,amount );

        console.log("owner balance after recieving usdc : ",await usdcContract.balanceOf(addr1));

        await usdcContract.connect(addr1).approve(treasury_address, amount);
        await treasury.connect(addr1).deposit(amount);

        console.log("succesfull swaps : ");

        let usdc_amount = await usdcContract.balanceOf(treasury_address);
        let usdt_amount = await usdtContract.balanceOf(treasury_address);
        let dai_amount = await daiContract.balanceOf(treasury_address);

        await treasury.connect(owner).withdraw(usdc_amount,usdcTokenAddress);
        await treasury.connect(owner).withdraw(usdt_amount,usdtTokenAddress);
        console.log("usdt : ",usdt_amount);
        await treasury.connect(owner).withdraw(dai_amount,daiTokenAddress);
        console.log("After with draw contract usdc balance",await usdcContract.balanceOf(treasury_address));
        console.log("After with draw contract dai balance",await daiContract.balanceOf(treasury_address));
    });

    // it("should calculate yield correctly", async function () {
    //     await treasury.connect(owner).setRatios(70, 30);
    //     const impersonatedSigner = await ethers.getImpersonatedSigner(USDC_WHALE);
    //     const usdtContract = await ethers.getContractAt('IERC20', usdcTokenAddress);
    //     await usdtContract.connect(impersonatedSigner).transfer(addr1, 100000000000);
    //     await usdtContract.connect(addr1).approve(treasury_address, 100000000000);
    //     await treasury.connect(addr1).deposit(50);
    //     const yieldAmount = await treasury.calculateYield();
    //     expect(yieldAmount).to.be.gt(0);
    // });


    // Add more test cases as needed
});
