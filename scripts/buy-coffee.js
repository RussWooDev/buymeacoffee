// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

//returns ether balance of an address
async function getBalance(address){
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  //makes the balanceBigInt human readable
  return hre.ethers.utils.formatEther(balanceBigInt);
}

//logs the ether bal for list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for(const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos) {
  for(const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.address;
    const message = memo.message;

    console.log(`At ${timestamp}, ${tipper} ${tipperAddress} said "${message}"`);
  }
}


async function main() {
  //get example acc
  const[owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  //deploy contract
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  //waiting for contract to deploy
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee has been deployed to ", buyMeACoffee.address);

  //check bal before coffee purchase
  const addresses = [owner.address, tipper1.address, buyMeACoffee.address];
  console.log("======== Start ========");
  await printBalances(addresses);


  //buy owner coffeess
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await buyMeACoffee.connect(tipper1).buyCoffee("Mr 1", "Yooooooooooooooooooooo", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Mr 2", "Get 2 shots", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Mr 3", "It's not for u, its for me", tip);

  //check bal after coffee purchases
  console.log("======== bought coffee ========");
  await printBalances(addresses);
   
  // withdraw funds
  console.log("======== Withdraw Tips ========");
  await buyMeACoffee.connect(owner).withdrawTips();
 
  // check balances after withdrawal;
  await printBalances(addresses);

  // read memos left
  console.log("======== Memos ========")
  const memos = await buyMeACoffee.getMemos();
  await printMemos(memos);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
