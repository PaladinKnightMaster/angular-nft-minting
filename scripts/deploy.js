async function main() {
    const MyNFTMarketplace = await ethers.getContractFactory("MyNFTMarketplace");
    const myNFTMarketplace = await MyNFTMarketplace.deploy();
  
    console.log("Contract deployed to address:", myNFTMarketplace.address);
}
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
});