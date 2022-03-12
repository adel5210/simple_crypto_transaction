let Transaction = artifacts.require("Transaction");

const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

contract("Transaction test", async accounts => {
    const[ownerAccount, recipient, anotherAccount] = accounts;
    let txnInstance;
    let registeredAnotherAccount;

    beforeEach(async () => {
        txnInstance = await Transaction.new({
           from: ownerAccount
        });
        await txnInstance.register(anotherAccount, {
            from: anotherAccount
        });
        registeredAnotherAccount = await txnInstance.users.call(anotherAccount, {
            from: anotherAccount
        });
    });

    it("Register of another account address", async ()=>{
        assert.equal(registeredAnotherAccount.registered, true);
    });

    it("Deposit 10 val", async () => {
        await txnInstance.deposit(10, {
            from: anotherAccount
        });
        registeredAnotherAccount = await txnInstance.users.call(anotherAccount, {
            from: anotherAccount
        });
        assert.equal(registeredAnotherAccount.balance.words[0],10);
    });

    it("Withdraw 5 val", async () => {
        await txnInstance.deposit(10, {
            from: anotherAccount
        });
        await txnInstance.withdraw(5, {
            from: anotherAccount
        });
        registeredAnotherAccount = await txnInstance.users.call(anotherAccount, {
            from: anotherAccount
        });
        assert.equal(registeredAnotherAccount.balance.words[0],5);
    });

});
