// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const contractAbi = require('../utils/usdc-abi');

// describe("Treasury", function () {
//   let Treasury;
//   let treasury;
//   let owner;
//   let addr1;

//   const uniswapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
//   const aaveLendingPoolAddress = "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf";
//   const usdcTokenAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
//   const usdtTokenAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
//   const daiTokenAddress = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";

//   const USDC_WHALE = "0xf977814e90da44bfa03b6295a0616a897441acec"
//   before(async function () {
//     [owner, addr1] = await ethers.getSigners();
//   });

//   beforeEach(async function () {
//     treasury = await ethers.deployContract("Treasury", [
//       uniswapRouterAddress,
//       aaveLendingPoolAddress,
//       usdcTokenAddress,
//       usdtTokenAddress,
//       daiTokenAddress,
//     ]);
//     await treasury.waitForDeployment();
//     const addres = treasury.getAddress();
//     // console.log("treasury address :",addr1.address);
//   });

//   it("should set correct ratios", async function () {
//     await treasury.connect(owner).setRatios(70, 30);
//     expect(await treasury.uniswapRatio()).to.equal(70);
//     expect(await treasury.aaveRatio()).to.equal(30);
//   });

//   it("should deposit and withdraw funds correctly", async function () {
//     const impersonatedSigner = await ethers.getImpersonatedSigner(USDC_WHALE);
//     const usdtContract = await ethers.getContractAt('IERC20', usdcTokenAddress);

//     // console.log
//     // const tx = await owner.sendTransaction({
//     //   to: USDC_WHALE,
//     //   value: ethers.parseEther("10"),
//     // });

//     await usdtContract.connect(impersonatedSigner).transfer(owner, 10)
//     console.log("it works");

//     const initialBalance = ethers.parseEther("1000");
//     const depositAmount = ethers.parseEther("500");
//     const ownerStartingBalance = await ethers.provider.getBalance(owner);
//     const tx1 = await usdtContract.balanceOf(owner);
//     console.log(tx1)


//     //     await treasury.connect(addr1).deposit(depositAmount);
//     //     expect(await treasury.calculateYield()).to.equal(0);

//     //     await treasury.connect(addr1).withdraw(depositAmount);
//     //     const ownerEndingBalance = await owner.getBalance();
//     //     expect(ownerEndingBalance).to.be.gt(ownerStartingBalance);
//   });

//   //   it("should calculate yield correctly", async function () {
//   //     const depositAmount = ethers.parseEther("500");
//   //     await treasury.connect(addr1).deposit(depositAmount);
//   //     const yieldAmount = await treasury.calculateYield();
//   //     expect(yieldAmount).to.be.gt(0);
//   //   });

//   // Add more test cases as needed
// });
