const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const JSONcompiled = require('./build/Inbox.json');
const abi =  JSONcompiled.abi;
const bytecode = JSONcompiled.evm.bytecode.object;

const provider = new HDWalletProvider(
    'rate frame network soul slot leisure knock spike clerk era keep supply', 'https://goerli.infura.io/v3/12c7488107c64faa84d1bba03decd919'
);

const web3 = new Web3(provider);
const INITIAL_STRING = 'Hi there!';

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('attempting to deploy from account: ', accounts[0]);
    const result = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: [INITIAL_STRING]})
    .send({ from: accounts[0], gas: '1000000' });
    console.log('Contract deployed to ', result.options.address);
    provider.engine.stop();
};
deploy();