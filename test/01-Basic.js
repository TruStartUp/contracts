const SC = artifacts.require('SC');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

contract('SC', (accounts) => {
  const [
    owner,
    notAllowed,
  ] = accounts;

  describe('Deployment', () => {
    it('should get the deployed contract', () => {
      SC.deployed().then((instance) => {
        sc = instance;
        expect(sc).not.to.be.null;
      });
    });
    it('should be registered to the expected owner', () => {
      return sc.isOwner({from: owner})
        .then((owned) => {
          expect(owned).to.be.true;
        });
    });
  });

  describe('Basic IO ops', () => {
    it('should allow the owner to write a string', () => {
      return sc.write('abc', {from: owner})
        .then((result) => {
          expect(result.tx).to.match(/0x[a-fA-F0-9]{64}/);
        });
    });
    it('should not allow others than owner to write a string', () => {
      return expect( sc.write('bcd', {from: notAllowed}) )
        .to.be.eventually.rejected;
    });
    it('should allow anyone to read the string', () => {
      return sc.text({from: notAllowed})
        .then((result) => {
          expect(result).to.eq('abc');
        });
    });
  });
});
