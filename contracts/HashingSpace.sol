pragma solidity >= 0.5.0 < 0.7.0;

contract HashingSpace {
  bytes32 public imgHash;
  string public name;
  mapping(bytes32 => bool) hs;

  constructor( bytes32 _imgHash, string memory _name ) public {
    imgHash = _imgHash;
    name = _name;
    for(uint i = 0; i < 5; i++) {
      bytes32 hashI = keccak256(abi.encodePacked(imgHash, i));
      hs[hashI] = true;
    }
  }

  function validate( bytes32 _testHash ) public view returns (bool){
    return hs[_testHash];
  }
}
