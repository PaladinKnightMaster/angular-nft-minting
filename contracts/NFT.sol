// SPDX-License-Identifier: MIT
pragma solidity >=0.7.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MyNFTMarketplace is ERC721, Ownable {
    using SafeMath for uint256;
    uint256 public nextTokenId;
    mapping (address => uint256[]) public tokenIdsOf;
    mapping (uint256 => uint256) public priceOfToken;
    mapping (uint256 => string) private tokenURIs;
    mapping (address => mapping(uint256 => bool)) public addressToTokenExists;

    constructor() ERC721("MyNFTMarketplace", "MNFT") {}

    function mint(string memory tokenURI, uint256 _price) public payable onlyOwner {
        require(msg.value >= _price, "Insufficient funds to mint");
        uint256 newTokenId = nextTokenId;
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        priceOfToken[newTokenId] = _price;
        tokenIdsOf[msg.sender].push(newTokenId);
        addressToTokenExists[msg.sender][newTokenId] = true;
        nextTokenId = nextTokenId.add(1);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "Token does not exist");
        tokenURIs[tokenId] = _tokenURI;
    }

    function setTokenPrice(uint256 _tokenId, uint256 _tokenPrice) public {
        require(_exists(_tokenId), "Token does not exist");
        require(msg.sender == ownerOf(_tokenId), "Only owner can set price");
        priceOfToken[_tokenId] = _tokenPrice;
    }

    function buyToken(uint256 _tokenId) public payable {
        require(_exists(_tokenId), "Token does not exist");
        require(msg.value >= priceOfToken[_tokenId], "Insufficient funds to buy");
        address ownerAddress = ownerOf(_tokenId);
        payable(ownerAddress).transfer(msg.value);
        _transfer(ownerAddress, msg.sender, _tokenId);
    }
}