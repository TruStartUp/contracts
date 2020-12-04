const HubJson = require('./build/contracts/Hub.json');

const hubAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';
const fs = require('fs');

getAccount = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts()
      .then((accounts) => {
        [owner, alice, bob, charlie] = accounts;
        resolve({owner, alice, bob, charlie});
      })
      .catch(reject);
  });
};

initialize = (callback) => {
  console.log('poh initialization...\n');
  const hubContract = new web3.eth.Contract(HubJson.abi, hubAddress);
  let owner;
  let alice;
  let signature;
  getAccount()
    .then((accounts) => {
      alice = accounts.alice;
      owner = accounts.owner;
      signature = hubContract.methods.addHashingSpace(
        '0x736cd375bb12862bc9851ae0782ae2fc059279e73e50e464f7eb6a66e3b2487b',
        'TRU',
        alice,
        );
      return signature.estimateGas({ from: owner })
    })
    .then((gas) => signature.send({ from: owner, gas }))
    .then(() => hubContract.methods.getApiKey(0, alice).call({ from: owner }))
    .then((apiKey) => {
      console.log(`API KEY: ${apiKey}`)
      return hubContract.methods.getHashingSpace(apiKey).call();
    })
    .then((hsAddress) => {
      console.log(`Hashing space address: ${hsAddress}`);
    })
    .catch(console.error)
    .then(() => {
      callback();
    });
};

module.exports = initialize;
