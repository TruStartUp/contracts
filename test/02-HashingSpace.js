const HashingSpace = artifacts.require('HashingSpaceStandard');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

const ipfsBytes32 = '0x318787a718972a977081bdae6d8adec7694eb99b0d9f8c83fc070d4db23a0287';

contract('Hashing space', (accounts) => {
  const [
    owner,
  ] = accounts;
  describe('Initialization', () => {
    it('should create a new contract upon ipfs hash and name', () => {
      const HS = new web3.eth.Contract(HashingSpace.abi);
      const deployHS = HS.deploy({
        data: HashingSpace.bytecode,
        arguments: [ ipfsBytes32, 'Hashing Space 1' ],
      });
      return deployHS.estimateGas({from: owner})
        .then(gas => deployHS.send({from: owner, gas}))
        .then(instance => instance.methods.ipfsHash().call())
        .then(ipfshash => {
          expect(ipfshash).to.eq(ipfsBytes32);
        });
    });
  });
  describe('Operational', () => {
    let hub;
    beforeEach(async() => {
      const HS = new web3.eth.Contract(HashingSpace.abi);
      const deployHS = HS.deploy({
        data: HashingSpace.bytecode,
        arguments: [ ipfsBytes32, 'Hashing Space 1' ],
      });
      const deployHSGas = await deployHS.estimateGas({ from: owner });
      hub = await deployHS.send({ from: owner, gas: deployHSGas });
    });
    it('should validate a hashed that was generated correctly', () => {
      return hub.methods.validate(web3.utils.soliditySha3(ipfsBytes32, 69), 69).call()
        .then(answer => {
          expect(answer).to.be.true;
        })
    });
  });
});
