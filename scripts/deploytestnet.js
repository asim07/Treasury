const { ethers } = require("hardhat");

async function main() {
  const uniswapRouterAddress = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
  const aaveLendingPoolAddress = "0x9198F13B08E299d85E096929fA9781A1E3d5d827";
  const usdcTokenAddress = "0xF493Af87835D243058103006e829c72f3d34b891  ";
  const usdtTokenAddress = "0xb062b3A919787060FD814AbE39844b81f89460c4";
  const daiTokenAddress = "0xC1E1C0Ab645Bd3C3156b20953784992013FDa98d";

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
