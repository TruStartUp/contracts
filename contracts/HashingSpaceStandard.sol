pragma solidity >= 0.5.0 < 0.7.0;

contract HashingSpaceStandard {
  bytes32 public ipfsHash;
  string public name;
  bytes32[100] hs;

  constructor(bytes32 _ipfsHash, string memory _name) public {
    ipfsHash = _ipfsHash;
    name = _name;
    for(uint i = 0; i < 100; i++) {
      hs[i] = keccak256(abi.encodePacked(ipfsHash, i));
    }
  }

  function validate(bytes32 _test, uint _idx) public view returns (bool){
    return keccak256(abi.encodePacked(_test)) == keccak256(abi.encodePacked(hs[_idx]));
  }
}
