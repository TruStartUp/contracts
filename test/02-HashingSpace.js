const HashingSpace = artifacts.require('HashingSpaceStandard');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

const imageHash = '0xdde9efca1ecfbadf34253c9a6ab6812280da630a1d96087e64f87b3935bfcfef';

contract('Hashing space', (accounts) => {
  const [
    owner,
  ] = accounts;
  describe('Initialization', () => {
    it('should create a new contract upon image hash and distance', () => {
      const HS = new web3.eth.Contract(HashingSpace.abi);
      const deployHS = HS.deploy({
        data: HashingSpace.bytecode,
        arguments: [ imageHash, 'web' ],
      });
      return deployHS.estimateGas({from: owner})
        .then(gas => deployHS.send({from: owner, gas}))
        .then(instance => instance.methods.imgHash().call())
        .then(imgHash => {
          expect(imgHash).to.eq(imageHash);
        });
    });
  });
  describe('Operational', () => {
    let hub;
    beforeEach(async() => {
      const HS = new web3.eth.Contract(HashingSpace.abi);
      const deployHS = HS.deploy({
        data: HashingSpace.bytecode,
        arguments: [ imageHash, 'web' ],
      });
      const deployHSGas = await deployHS.estimateGas({ from: owner });
      hub = await deployHS.send({ from: owner, gas: deployHSGas });
    });
    it('should validate a hashed that was generated correctly', () => {
      return hub.methods.validate(web3.utils.soliditySha3(imageHash, 4)).call()
        .then(answer => {
          expect(answer).to.be.true;
        })
    });
    it('should get a false response with an invalid hash', () => {
      return hub.methods.validate(web3.utils.soliditySha3(imageHash, 5)).call()
        .then(answer => {
          expect(answer).to.be.false;
        })
    });
  });
});
