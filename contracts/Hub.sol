pragma solidity >= 0.5.0 < 0.7.0;

import "./HashingSpace.sol";

contract Hub {
  mapping(address => bytes32[]) userApiKeys;
  mapping(bytes32 => HashingSpace) userHashingSpaces;
  address public owner;

  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function addHashingSpace(bytes32 _imgHash, string memory _name, address _user) public onlyOwner {
    bytes32 _apiKey = keccak256(abi.encodePacked(_imgHash, _name, block.number));
    userApiKeys[_user].push(_apiKey);
    HashingSpace _hashingSpace = new HashingSpace(_imgHash, _name);
    userHashingSpaces[_apiKey] = _hashingSpace;
  }

  function getApiKey(uint _idx, address _user) public view onlyOwner returns (bytes32 apiKey) {
    apiKey = userApiKeys[_user][_idx];
  }

  function getHashingSpace(bytes32 apiKey) public view returns (HashingSpace hashingSpaceIndex) {
    hashingSpaceIndex = userHashingSpaces[apiKey];
  }
}
