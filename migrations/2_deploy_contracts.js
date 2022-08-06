const Market = artifacts.require("Market");
const NFT = artifacts.require("NFT");

module.exports = async function(deployer) {
  deployer.deploy(Market).
  then(() => console.log(Market.address)).
  then(() => deployer.deploy(NFT , Market.address)).
  then(() => console.log(NFT.address));
};
