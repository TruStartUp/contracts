const Hub = artifacts.require('Hub');
const HashingSpace = artifacts.require('HashingSpaceStandard');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

const imageHash = '0xdde9efca1ecfbadf34253c9a6ab6812280da630a1d96087e64f87b3935bfcfef';

contract('Hub', (accounts) => {
  const [
    owner,
    alice,
  ] = accounts;
  let hub;
  beforeEach(async() => {
    const HubContract = new web3.eth.Contract(Hub.abi);
    const hubDeployment = HubContract.deploy({ data: Hub.bytecode });
    const hubGas = await hubDeployment.estimateGas({ from: owner });
    hub = await hubDeployment.send({ from: owner, gas: hubGas });
  });
  describe('Deployment', () => {
    it('should get a valid instance after deployment', () => {
      return expect(hub.methods).to.have.property('addHashingSpace');
    });
  });
  describe('Operational', () => {
    it('should add a hashing space upon name and image hash', () => {
      const addHashingSpaceSignature = hub.methods.addHashingSpace(imageHash, 'web');
      return addHashingSpaceSignature.estimateGas({from: alice})
        .then(gas => addHashingSpaceSignature.send({from: alice, gas}))
        .then(() => hub.methods.userHashingSpaces(0).call({from: alice}))
        .then(hashingSpaceAddress => {
          expect(hashingSpaceAddress).to.match(/0x[a-fA-F0-9]{40}/);
          return new web3.eth.Contract(HashingSpace.abi, hashingSpaceAddress);
        })
        .then(hashingSpace => hashingSpace.methods.name().call())
        .then(name => {
          expect(name).to.eq('web');
        });
    });
  });
});
