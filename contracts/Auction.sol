pragma solidity ^0.5.1;
pragma experimental ABIEncoderV2;

contract BiddingContract
{
    struct Bid {
        uint bidId;
        uint timestamp;
        uint endTime;
        address payable bidCreater;
        string bidCreaterName;
        uint minBidAmount;
        address payable [] bidders; 
        uint256[] bids;
        bool done;
    }
    
    mapping(uint => Bid) Bids;

    function createAuc(uint bidId, uint minBidAmount ,string memory bidCreaterName) public {
        Bids[bidId].bidCreater = msg.sender;
        Bids[bidId].bidCreaterName = bidCreaterName;
        Bids[bidId].minBidAmount = minBidAmount;
        Bids[bidId].timestamp = block.timestamp;
        Bids[bidId].endTime = block.timestamp + 5 seconds;
        Bids[bidId].done = false;
    }
    
    function submitBid(uint bidId) payable public {
        require(msg.sender != Bids[bidId].bidCreater);
        require(msg.value >= Bids[bidId].minBidAmount);
        require(Bids[bidId].done == false);
        
        Bids[bidId].bidCreater.transfer(msg.value);
        Bids[bidId].bidders.push(msg.sender);
        Bids[bidId].bids.push(msg.value);
    }

    function getAllAuc(uint bidId) public view returns (bool, address, uint, string memory) {
        return (Bids[bidId].done, Bids[bidId].bidCreater, Bids[bidId].minBidAmount, Bids[bidId].bidCreaterName);
    }
    
    function getAllBidPrice(uint bidId) public view returns (uint[] memory) {
        return (Bids[bidId].bids);
    }
    
    function getAllBidders(uint bidId) public view returns (address payable [] memory) {
        return (Bids[bidId].bidders);
    }
    
    //finalize function
    //send token with msg.value 
    
    function finalize(uint bidId) public {
        require(msg.sender == Bids[bidId].bidCreater);
        require(Bids[bidId].done == false);
        
        Bids[bidId].done = true;
    }
    
    function getMaxBid(uint bidId) public view returns (uint largest, address winner) 
    {
        require(Bids[bidId].done == true, "Bid still running");
        largest = 0;
        for(uint i = 0; i < Bids[bidId].bids.length; i++) {
            if(Bids[bidId].bids[i] > largest) {
                largest = Bids[bidId].bids[i];
                winner = Bids[bidId].bidders[i];
            }
        }
        
        return (largest, winner);
    }
}
