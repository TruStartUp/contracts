pragma solidity >= 0.5.0 < 0.7.0;

import '@openzeppelin/contracts/ownership/Ownable.sol';

contract SC is Ownable {
  string public text;

  constructor() public {
  }

  function write(string memory _text) public onlyOwner {
    text = _text;
  }
}
