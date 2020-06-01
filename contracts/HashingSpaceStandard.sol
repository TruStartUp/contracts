pragma solidity >= 0.5.0 < 0.7.0;

contract HashingSpaceStandard {
  bytes32 public ipfsHash;
  string public name;

  constructor(bytes32 _ipfsHash, string memory _name) public {
    ipfsHash = _ipfsHash;
    name = _name;
  }
}
