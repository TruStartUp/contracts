const Hub = artifacts.require('Hub');

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
  let hubDeployed;
  beforeEach(async() => {
    const HubContract = new web3.eth.Contract(Hub.abi);
    const hubDeployment = HubContract.deploy({ data: Hub.bytecode });
    const hubGas = await hubDeployment.estimateGas({ from: owner });
    hub = await hubDeployment.send({ from: owner, gas: hubGas });

    hubDeployed = await Hub.deployed();
  });
  describe('Deployment', () => {
    it('should get a valid instance after deployment', () => {
      return expect(hub.methods).to.have.property('addHashingSpace');
    });
  });
  describe('Operational', () => {
    it('should return the owner of the Hub', () => {
      return hub.methods.owner().call()
        .then((owner) => expect(owner).to.eq(owner));
    });
    it('should allow only owner to add new hashing spaces', () => {
      return hubDeployed.addHashingSpace(imageHash, 'web', alice)
        .then((tx) => expect(tx.tx).to.match(/0x[0-9a-fA-F]{64}/));
    });
    it('should not allow other user not owner to add a new hashing space', () => {
      return expect(hubDeployed.addHashingSpace(imageHash, 'web', alice, {from: alice}))
        .to.be.eventually.rejected;
    });
    it('should return the apiKey of the hashing space created', () => {
      return hubDeployed.addHashingSpace(imageHash, 'web', alice)
        .then(() => hubDeployed.getApiKey(0, alice))
        .then((apiKey) => expect(apiKey).to.match(/0x[0-9a-fA-F]{64}/));
    });
    it('should not return the apiKey for other user not owner', () => {
      return hubDeployed.addHashingSpace(imageHash, 'web', alice)
        .then(() => expect(hubDeployed
          .getApiKey(0, alice, {from: alice})).to.be.eventually.rejected);
    });
    it('should return the Hashing space address given an apiKey', () => {
      return hubDeployed.getApiKey(0, alice)
        .then((apiKey) => hubDeployed.getHashingSpace(apiKey))
        .then((HSAddress) => expect(HSAddress).to.match(/0x[0-9a-fA-F]{40}/));
    });
  });
});
