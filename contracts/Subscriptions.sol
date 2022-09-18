// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Subscriptions is ERC721Enumerable {
  uint256 constant fee = 10e18;
  ERC20 constant dai = ERC20(0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E);  //dai @ ftm

  address public owner;
  uint256 public nextToken = 1;
  mapping(uint256 => uint256) public subscriptions;

  event Subscribe(address indexed user);
  event Sweep(address indexed owner, uint256 balance);

  constructor() ERC721("Dexcalidraw One Year Subscription", "Dexcalidraw-1YR") {
    owner = msg.sender;
  }

  function subscribe() public {
    dai.transferFrom(msg.sender, address(this), fee);
    subscriptions[nextToken] = block.timestamp;
    _safeMint(msg.sender, nextToken);
    nextToken++;
    emit Subscribe(msg.sender);
  }

  function expired(uint256 token) public view returns (bool) {
    uint256 elapsed = block.timestamp - subscriptions[token];
    return elapsed > (365 days);
  }

  function sweep() public {
    require(msg.sender == owner, "!owner");
    uint256 balance = dai.balanceOf(address(this));
    dai.transferFrom(address(this), msg.sender, balance);
    emit Sweep(msg.sender, balance);
  }
}