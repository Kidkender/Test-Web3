
/** @type import('hardhat/config').HardhatUserConfig */



//https://eth-goerli.g.alchemy.com/v2/OUu5C8-8OMLZ-NHaqRjhni3s9n6VBFqq
 
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: "0.8.9",
  networks:{
    goerli:{
      url: "https://eth-goerli.g.alchemy.com/v2/OUu5C8-8OMLZ-NHaqRjhni3s9n6VBFqq",
      accounts:["9169f188b3b74a8fcca45d2dde751e93d0cb10516db54fb25c6974e2bb0f9bcf"]
    }
  }
}