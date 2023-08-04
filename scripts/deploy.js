const { ethers } = require("hardhat");

async function main() {
  const uniswapRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const aaveLendingPoolAddress = "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf";
  const usdcTokenAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const usdtTokenAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
  const daiTokenAddress = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";

  const treasury = await ethers.deployContract("Treasury", [
    uniswapRouterAddress,
    aaveLendingPoolAddress,
    usdcTokenAddress,
    usdtTokenAddress,
    daiTokenAddress,
  ]);

  await treasury.waitForDeployment();
  let treasury_address = await treasury.getAddress();

  console.log("Treasury deployed to:", treasury_address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
