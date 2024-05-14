pragma solidity ^0.5.0;

contract Donation {
    address public owner;
    string public name;
    mapping(address => uint256) public donors;
    uint256 public currentAmount;
    uint256 public totalAmount;

    constructor() public {
        owner =  msg.sender;
        name = "Charity Donation";
        currentAmount = address(this).balance;
        totalAmount = address(this).balance;
    }

    event Donated(address _donor, uint256 _amount);
    event OrganizerWithdrawn(uint256 _amount);

    function donate() public payable {
        require(msg.value > 0, "Please donate at least 1 wei");
        donors[msg.sender] += msg.value;
        currentAmount += msg.value;
        totalAmount += msg.value;

        emit Donated(msg.sender, msg.value);
    }

    function organizerWithdraw(address payable _to) public {
        require(msg.sender == owner, "Only the organizer can withdraw");

        uint256 amount = currentAmount;
        currentAmount = 0;
        totalAmount += amount;
        _to.transfer(amount);

        emit OrganizerWithdrawn(amount);
    }

    function getCurrentAmount() public view returns (uint256) {
        return currentAmount;
    }

    function getTotalAmount() public view returns (uint256) {
        return totalAmount;
    }

    function getName() public view returns (string memory) {
        return name;    
    }

    function getOrganizer() public view returns (address) {
        return owner;
    }
}