const HashingSpace = artifacts.require('HashingSpace');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

contract('Hashing space', (accounts) => {
  const [
    owner,
  ] = accounts;
  describe('Initialization', () => {
    it('should fail if no constructor parameters are passed', () => {
      const HS = new web3.eth.Contract(HashingSpace.abi);
      const deployHS = HS.deploy({
        data: HashingSpace.bytecode,
        arguments: [],
      });
      return deployHS.estimateGas({from: owner})
        .then(gas => deployHS.send({from: owner, gas}))
        .then(result => {
          expect(result._address).to.match(/0x[a-fA-F0-9]{40}/);
        });
    });
  });
});
