// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Import this file to use console.log
import "hardhat/console.sol";

// Deployed to Goerli at 0x6d15131e847EbEF26C5C8D27cd5bf68dEd84eebb

contract BuyMeACoffee {
    //event emit when memo created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //memo struct. 
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //list of all memo received. This creatres a list of structs inside memos
    Memo[] memos;

    // address of contract deployer
    address payable owner;

    //deploy logic and only ran once
    constructor() {
        //we need to cast the msg.sender as payable so it can be paid in the furture (owner paid)
        owner = payable(msg.sender);
    }

    /**
     * @dev buying a coffee for the contract owner
     * @param _name name of the person buying the coffee
     * @param _message msg sent by buyer
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, 'CMon man... cant buy coffee with nuthin');

        // saving a memo struct into the memos array. Adds memo to storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        //emits a log event when a new memo is created of someone buying a coffee for owner
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /**
     * @dev allows us to send the whole balance to owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev retrieve all memos stored in blockchain
     */
    function getMemos() public view returns(Memo[] memory){
        return memos;
    }
}
