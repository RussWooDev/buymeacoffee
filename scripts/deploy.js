const hre = require("hardhat");

async function main() {
    //deploy contract
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();
    //waiting for contract to deploy
    await buyMeACoffee.deployed();
    console.log("BuyMeACoffee has been deployed to ", buyMeACoffee.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });