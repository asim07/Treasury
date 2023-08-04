const { ethers } = require('hardhat');

async function main() {
    const provider = ethers.provider;

    // Replace with the actual USDC contract address on mainnet
    const usdcAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

    // Replace with the address you want to check the balance for
    const addressToCheck = '0xf977814e90da44bfa03b6295a0616a897441acec';

    // Load the USDC contract
    const usdcContract = await ethers.getContractAt('IERC20', usdcAddress);

    // Get the balance of the specified address
    const balance = await usdcContract.balanceOf(addressToCheck);
    console.log(`Balance of ${addressToCheck}: ${balance.toString()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
