const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const JSONcompiled = require('../build/Inbox.json');
const abi =  JSONcompiled.abi;
const bytecode = JSONcompiled.evm.bytecode.object;

let accounts;
let inbox;
beforeEach(async () => {
    // get list of all accounts
    accounts = await web3.eth.getAccounts();

    // use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: ['Hi there!']})
    .send({ from: accounts[0], gas: '1000000' });
})

describe('Inbox', () => {
    it('deploys a contract', () => {
        console.log(inbox);
    })
})