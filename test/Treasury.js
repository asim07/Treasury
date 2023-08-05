const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("Treasury", function () {
    let treasury_address;
    let treasury;
    let owner;

    const uniswapRouterAddress = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
    const aaveLendingPoolAddress = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
    const usdcTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const busdTokenAddress = "0x4Fabb145d64652a948d72533023f6E7A623C7C53";
    const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";


    const USDC_WHALE = "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503";

    before(async function () {
        [owner] = await ethers.getSigners();
    });

    beforeEach(async function () {
        treasury = await ethers.deployContract("Treasury", [
            usdcTokenAddress,
            busdTokenAddress,
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
        expect(await treasury.busdAllocationRatio()).to.equal(30);
        expect(await treasury.daiAllocationRatio()).to.equal(40);
    });

    it("should deposit USDC, swapp to other tokens( BUSD, DAI) according to Ratio and withdraw funds correctly  ( USDC , BUSD , DAI )", async function () {
        const usd_whale = await ethers.getImpersonatedSigner(USDC_WHALE);
        const usdcContract = await ethers.getContractAt('IERC20', usdcTokenAddress);
        const busdContract = await ethers.getContractAt('IERC20', busdTokenAddress);
        const daiContract = await ethers.getContractAt('IERC20', daiTokenAddress);

        await treasury.setAllocationRatios(33,33,34);
        const amount = ethers.parseUnits('50000',6);
        await usdcContract.connect(usd_whale).transfer(owner,amount );

        await usdcContract.connect(owner).approve(treasury_address, amount);
        await treasury.connect(owner).deposit(amount);


        let usdc_amount = await usdcContract.balanceOf(treasury_address);
        let busd_amount = await busdContract.balanceOf(treasury_address);
        let dai_amount = await daiContract.balanceOf(treasury_address);
        
        await treasury.connect(owner).withdraw(usdc_amount,usdcTokenAddress);
        await treasury.connect(owner).withdraw(busd_amount,busdTokenAddress);
        await treasury.connect(owner).withdraw(dai_amount,daiTokenAddress);

    });

    it("Deposit funds to aave and withdraw", async function () {
        const usd_whale = await ethers.getImpersonatedSigner(USDC_WHALE);
        const usdcContract = await ethers.getContractAt('IERC20', usdcTokenAddress);
        const busdContract = await ethers.getContractAt('IERC20', busdTokenAddress);
        const daiContract = await ethers.getContractAt('IERC20', daiTokenAddress);

        await treasury.setAllocationRatios(33,33,34);
        const amount = ethers.parseUnits('50000',6);
        await usdcContract.connect(usd_whale).transfer(owner,amount );

        await usdcContract.connect(owner).approve(treasury_address, amount);
        await treasury.connect(owner).deposit(amount);

        let usdc_amount = await usdcContract.balanceOf(treasury_address);
        let busd_amount = await busdContract.balanceOf(treasury_address);
        let dai_amount = await daiContract.balanceOf(treasury_address);

        await treasury.connect(owner).depositToAave(usdc_amount,usdcTokenAddress);
        // await treasury.connect(owner).depositToAave(busd_amount,busdTokenAddress); aave not supporting deposit BUSD
        await treasury.connect(owner).depositToAave(dai_amount,daiTokenAddress);

        await treasury.connect(owner).withdrawFromAave(usdc_amount,usdcTokenAddress);
        await treasury.connect(owner).withdrawFromAave(dai_amount,daiTokenAddress);


    });

    it("Swapping tokens from USDC to DAI", async function () {
        const usd_whale = await ethers.getImpersonatedSigner(USDC_WHALE);
        const usdcContract = await ethers.getContractAt('IERC20', usdcTokenAddress);

        await treasury.setAllocationRatios(33,33,34);
        const amount = ethers.parseUnits('50000',6);
        await usdcContract.connect(usd_whale).transfer(owner,amount );

        await usdcContract.connect(owner).approve(treasury_address, amount);
        await treasury.connect(owner).deposit(amount);

        let usdc_amount = await usdcContract.balanceOf(treasury_address);

        await treasury.connect(owner).swapToken(usdcTokenAddress,daiTokenAddress,usdc_amount);

    });


    // Add more test cases as needed
});
