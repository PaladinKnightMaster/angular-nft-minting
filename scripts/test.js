const { expect } = require("chai");
const { ethers } = require("hardhat");

const { abi } = require("../artifacts/contracts/NFT.sol/MyNFTMarketplace.json")

describe("MyNFTMarketplace", function () {
    let MyNFTMarketplace, myNFTMarketplace, owner, addr1, addr2;
    const contractAddress = "0x74a28583244953cBb267Ed889a5c4Df03BA7FEb5";  // update this with contract address

    beforeEach(async function () {
        try {
            MyNFTMarketplace = await ethers.getContractFactory("MyNFTMarketplace");
            [owner, addr1, addr2, _] = await ethers.getSigners();
            console.log("TTTTT")
            // myNFTMarketplace = await MyNFTMarketplace.deploy();
            // await myNFTMarketplace.deployed();
            myNFTMarketplace = await MyNFTMarketplace.attach(contractAddress, abi, owner);
        } catch (error) {
            console.error(error);
            expect.fail("Error occurred: " + error.message);
        }        
    });

    it("Should mint a new token", async function () {
        try {
            await myNFTMarketplace.connect(owner).mint("tokenURI", 100);
            const nextTokenId = await myNFTMarketplace.nextTokenId();
            expect(nextTokenId).to.equal(1);
          } catch (error) {
            // Handle the error here, if any
            console.error(error);
            // Fail the test
            expect.fail("Error occurred: " + error.message);
          }
    });

    it("Should fail to mint if not owner", async function () {
        await expect(myNFTMarketplace.connect(addr1).mint("tokenURI", 100)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set token price", async function () {
        await myNFTMarketplace.connect(owner).mint("tokenURI", 100);
        await myNFTMarketplace.connect(owner).setTokenPrice(0, 200);
        expect(await myNFTMarketplace.priceOfToken(0)).to.equal(200);
    });

    it("Should fail to set price if not owner", async function () {
        await myNFTMarketplace.connect(owner).mint("tokenURI", 100);
        await expect(myNFTMarketplace.connect(addr1).setTokenPrice(0, 200)).to.be.revertedWith("Only owner can set price");
    });

    it("Should buy token", async function () {
        await myNFTMarketplace.connect(owner).mint("tokenURI", 100);
        await myNFTMarketplace.connect(addr1).buyToken(0, { value: ethers.utils.parseEther("1") });
        expect(await myNFTMarketplace.ownerOf(0)).to.equal(addr1.address);
    });

    it("Should fail to buy if insufficient funds", async function () {
        await myNFTMarketplace.connect(owner).mint("tokenURI", 100);
        await expect(myNFTMarketplace.connect(addr1).buyToken(0, { value: ethers.utils.parseEther("0.01") })).to.be.revertedWith("Insufficient funds to buy");
    });
});