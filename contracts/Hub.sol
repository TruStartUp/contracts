pragma solidity >= 0.5.0 < 0.7.0;

import "./HashingSpaceStandard.sol";

contract Hub {
  mapping(address => HashingSpaceStandard[]) _userHashingSpaces;

  constructor() public {
  }

  function addHashingSpace(bytes32 _imgHash, string memory _name) public {
    HashingSpaceStandard _hashingSpace = new HashingSpaceStandard(_imgHash, _name);
    _userHashingSpaces[msg.sender].push(_hashingSpace);
  }

  function userHashingSpaces(uint _idx) public view returns (HashingSpaceStandard) {
    return _userHashingSpaces[msg.sender][_idx];
  }
}
