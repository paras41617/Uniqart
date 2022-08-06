// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract Market is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;

  uint randNonce = 0;
  address payable owner;
  uint256 listingPrice = 0.025 ether;

  constructor() {
    owner = payable(msg.sender);
  }

  struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool on_sale;
    uint no_of_transfers;
    uint likes;
    address payable mintedby;
    uint ranking;
  }

  mapping(uint256 => MarketItem) private idToMarketItem;
  mapping(uint256 => mapping(string => uint256)) private like_addresses;
  mapping(uint256 => uint256) private rankings;

  event MarketItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool on_sale,
    uint no_of_transfers,
    uint likes,
    address mintedby,
    uint ranking
  );

  function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }

  function randMod(uint _modulus) internal returns(uint)
{ 
   randNonce++; 
   return uint(keccak256(abi.encodePacked(block.timestamp,msg.sender,randNonce))) % _modulus;
 }

  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price,
    uint256 no_of_transfers,
    uint256 likes
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();
  
    idToMarketItem[itemId] =  MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      true,
      no_of_transfers,
      likes,
      payable(msg.sender),
      0
    );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      true,
      no_of_transfers,
      likes,
      msg.sender,
      0
    );
  }

  function createMarketSale(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    uint price = idToMarketItem[itemId].price;
    uint tokenId = idToMarketItem[itemId].tokenId;
    require(msg.value == price, "Please submit the asking price in order to complete the purchase");

    idToMarketItem[itemId].seller.transfer(msg.value);
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].on_sale = false;
    idToMarketItem[itemId].no_of_transfers += 1;
    _itemsSold.increment();
    payable(owner).transfer(listingPrice);
  }

  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].on_sale == true) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].on_sale == true) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function sell_nft(address nftContract , uint256 _tokenId , uint256 price) public payable nonReentrant{
      require(price > 0, "Price must be at least 1 wei");
      require(msg.value == listingPrice, "Price must be equal to listing price");
      idToMarketItem[_tokenId].on_sale = true;
      IERC721(nftContract).transferFrom(msg.sender, address(this), _tokenId);
  }

  function increase_likes(uint256 _tokenId , string memory _address) public payable nonReentrant {
      if(like_addresses[_tokenId][_address] == 0){
        idToMarketItem[_tokenId].likes+=1;
        like_addresses[_tokenId][_address] +=1;
      }
  }

  function check_likes(uint256 _tokenId , string memory _address) public view returns(uint){
    return like_addresses[_tokenId][_address];
  }

  function remove_nft(address nftContract , uint256 _tokenId) public payable nonReentrant{
      require(msg.value == listingPrice, "Price must be equal to listing price");
      idToMarketItem[_tokenId].on_sale = false;
      IERC721(nftContract).transferFrom(address(this), msg.sender, _tokenId);
  }

  function change_price(uint256 _tokenId , uint256 price) public payable nonReentrant {
      idToMarketItem[_tokenId].price = price;
  }
  
}