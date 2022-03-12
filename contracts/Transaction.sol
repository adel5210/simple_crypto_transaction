// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

    struct User{
        uint index;
        bool registered;
        uint balance;
        uint actualWei;
    }

contract Transaction {

    address payable owner;
    uint totalWei;

    mapping(address => User) public users;
    mapping(uint => address) public indexUsers;
    uint public totalAmount;
    uint public totalUsers;

    event TransactionProcessed(address indexed _address, uint _amount);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyRegisteredUser(address _processingUser) {
        require(users[_processingUser].registered, "Register your address first");
        _;
    }

    function register(address _address) public{
        require(_address == msg.sender, "Only registered address is required");
        require(!users[_address].registered, "Address already registered");
        users[_address].balance = 0;
        users[_address].registered = true;
        users[_address].index = totalUsers;
        indexUsers[totalUsers] = _address;
        totalUsers++;

        emit TransactionProcessed(_address, 0);
    }

    function deposit(uint _amount) public {
        address _processingUser = msg.sender;
        require(users[_processingUser].registered, "Register your address first");
        require(_amount <= 1000, "Max deposit of 1000 TK only");
        totalAmount+=_amount;
        users[_processingUser].balance += _amount;

        emit TransactionProcessed(_processingUser, _amount);
    }

    function withdraw(uint _amount) public {
        address _processingUser = msg.sender;
        require(users[_processingUser].registered, "Register your address first");
        require(_amount <= users[_processingUser].balance, "Insufficient balance");
        totalAmount-=_amount;
        users[_processingUser].balance -= _amount;

        emit TransactionProcessed(_processingUser, _amount);
    }

    function donation() public payable onlyRegisteredUser(msg.sender){
        users[msg.sender].actualWei += msg.value;
        totalWei+=msg.value;
        emit TransactionProcessed(msg.sender, msg.value);
    }

    function getTotalBalance() public view returns(uint){
        return totalAmount;
    }

    function getListOfUserAddress() public view returns(address[] memory){
        address[] memory result = new address[](totalUsers);
        for(uint i=0; i<totalUsers; i++){
            result[i] = indexUsers[i];
        }
        return result;
    }

    function getListOfUserBalance() public view returns(uint[] memory){
        uint[] memory result = new uint[](totalUsers);
        for(uint i=0; i<totalUsers; i++){
            result[i] = users[indexUsers[i]].balance;
        }
        return result;
    }

    receive() external payable{
        donation();
    }

    fallback() external{}

}
