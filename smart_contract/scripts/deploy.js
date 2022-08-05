// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

// const main = async () => {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//   const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

//   const lockedAmount = hre.ethers.utils.parseEther("1");

//   const Lock = await hre.ethers.getContractFactory("Lock");
//   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//   await lock.deployed();

//   console.log("Lock with 1 ETH deployed to:", lock.address);
// }

// const main =async() => {
//   const currentTimestampInSeconds =Math.round(Date.now()/1000);
//   const ONE_YEAR_IN_SECS =365*24*60*60;
//   const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

//   const lockedAmount = hre.ethers.utils.parseEther("1");

//   const Transactions = await hre.ethers.getContractFactory("transactions");
//   const transactions = await Transactions.deploy(unlockTime, { value: lockedAmount });
//   await transactions.deployed();

//   console.log("Transactions deployed to : ",transactions.address);
// }

// const runMain = async () => {
//   try {
//     await main();
//     process.exit(0);

//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// }
//  runMain();


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.


// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


const main = async () => {
  const transactionsFactory = await hre.ethers.getContractFactory("Transactions");
  const transactionsContract = await transactionsFactory.deploy();

  await transactionsContract.deployed();

  console.log("Transactions address: ", transactionsContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();