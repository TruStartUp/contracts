pragma solidity >= 0.5.0 < 0.7.0;

import "./HashingSpaceStandard.sol";

contract Hub {
  mapping(address => userHS) userData;
  address public owner;
  struct userHS {
    mapping(bytes32 => uint) apiIndex;
    bytes32[] apiKeys;
    HashingSpaceStandard[] userHashingSpaces;
  }

  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function addHashingSpace(bytes32 _imgHash, string memory _name, address _user) public onlyOwner {
    userHS storage userInfo = userData[_user];
    bytes32 _apiKey = keccak256(abi.encodePacked(_imgHash, _name, block.number));
    userInfo.apiKeys.push(_apiKey);
    userInfo.apiIndex[_apiKey] = userInfo.apiKeys.length;
    HashingSpaceStandard _hashingSpace = new HashingSpaceStandard(_imgHash, _name);
    userInfo.userHashingSpaces.push(_hashingSpace);
  }

  function getUserData(address _user) internal view returns (userHS memory userInfo) {
    userInfo = userData[_user];
  }

  function getApiKey(uint _idx) public view returns (bytes32 apiKey) {
    userHS memory userInfo = getUserData(msg.sender);
    apiKey = userInfo.apiKeys[_idx];
  }
}
