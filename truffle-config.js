const path = require("path");
require('dotenv').config({path: './.env'});
const HDWallerProvider = require("@truffle/hdwallet-provider");
const MetaMaskAccountIndex = 0;

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      port: 7545,
      network_id:"*",
      host:"127.0.0.1"
    },
    ganache_local:{
      provider: function (){
        return new HDWallerProvider(process.env.MNEMONIC, "http://127.0.0.1:7545", MetaMaskAccountIndex)
      },
      network_id: 5777,
    },
    ropsten_infura:{
      provider: function (){
        return new HDWallerProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/"+process.env.INFURA_PROJECT_ID, MetaMaskAccountIndex)
      },
      network_id: 3,
    },
    goerli_infura:{
      provider: function (){
        return new HDWallerProvider(process.env.MNEMONIC,"https://goerli.infura.io/v3/"+process.env.INFURA_PROJECT_ID, MetaMaskAccountIndex)
      },
      network_id: 5,
    },
    kovan_infura:{
      provider: function () {
        return new HDWallerProvider(process.env.MNEMONIC,"https://kovan.infura.io/v3/"+process.env.INFURA_PROJECT_ID, MetaMaskAccountIndex)
      },
      network_id: 42,
    },
    rinkeby_infura:{
      provider: function () {
        return new HDWallerProvider(process.env.MNEMONIC,"https://rinkeby.infura.io/v3/"+process.env.INFURA_PROJECT_ID, MetaMaskAccountIndex)
      },
      network_id: 4,
    }
  },
  compilers:{
    solc:{
      version:"^0.6.0"
    }
  }
};
