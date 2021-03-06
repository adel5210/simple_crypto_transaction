# Simple Transaction (Web3Js+ReactJs) 
A simple transactional blockchain project built with minimal test [Ethereum](https://en.wikipedia.org/wiki/Ethereum) over a private test network (Ganache) or on a public test network (Rinkeby, Kovan, etc.). Deploying Smart Contract on a public test network can be done thru [Infura](https://infura.io/). It comes with ReactJs interface where it could be interacted thru the browser.


# Requirements
- Ensure that you have a crypto-wallet, for example [Metamask](https://metamask.io/), being setup.
- Download Ganache for a private Ethereum blockchain.

## Frameworks
- [Truffle](https://trufflesuite.com/) v5.1.8
- ReactJs
- NodeJs v12.18.0

## Setup

### New installation
- Create a new directory and initialize npm with ```npm init -y```
- Add Truffle dependency with ```npm install -g truffle@5.1.8```
- Add Web3Js dependency with ```npm install --save web3```
- Add DotEnv dependency with ```npm install --save dotenv```
- Add HDWallet-provider dependency with ```npm install @truffle/hdwallet-provider```
- Add Truffle-Assertions dependency with ```npm install truffle-assertions```

You could check ```package.json``` for reference. 

### Dotenv
For deploying on a public test network, create ```.env``` file on current directory and add your MNEMONIC and INFURA_PROJECT_ID for the config under ```truffle-config.js```

# Deployment 
## Private Network
On the current directory, execute a local develop network:
```
truffle develop
```
This will instantiate a development blockchain locally on port 9545 alongside with 10 sample accounts with their private keys.

Compile the contracts on another terminal with 
```
truffle compile
```
If no errors occurs, migrattion can be done on current session terminal with 

```
migrate --reset
```
or on a new terminal with
```
truffle migrate --reset
```
### On Browser
- On a new terminal, change your working directory to client
- Ensure npm packages is installed 
- Run it with ```npm run start```
- It will automatically opens your browser with ```localhost:3000``` 

# Testing
Test can be done on a new terminal with
```
truffle test
```

With its expected output:
```
 Contract: Transaction test
    ??? Register of another account address
    ??? Deposit 10 val (612ms)
    ??? Withdraw 5 val (1009ms)


  3 passing (4s)

```
