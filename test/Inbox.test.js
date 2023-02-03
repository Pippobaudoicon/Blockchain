const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const JSONcompiled = require('../build/Inbox.json');
const abi =  JSONcompiled.abi;
const bytecode = JSONcompiled.evm.bytecode.object;

let accounts;
let inbox;
const INITIAL_STRING = 'Hi there!';

beforeEach(async () => {
    // get list of all accounts
    accounts = await web3.eth.getAccounts();

    // use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: [INITIAL_STRING]})
    .send({ from: accounts[0], gas: '1000000' });
})

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
        //console.log(inbox);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING)
    });

    it('can change the message', async () => {
        let messageSet = 'bye';
        await inbox.methods.setMessage(messageSet).send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, messageSet);
    })
});