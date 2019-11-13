pragma solidity ^0.5.1;
pragma experimental ABIEncoderV2;

contract BiddingContract
{
    struct Bid {
        uint bidId;
        uint timestamp;
        address payable bidCreater;
        string bidCreaterName;
        uint minBidAmount;
        address payable [] bidders; 
        uint256[] bids;
        bool done;
    }
    
    string[][] bids;
    
    mapping(uint => Bid) Bids;

    function createAuc(uint bidId, uint minBidAmount ,string memory bidCreaterName) public {
        Bids[bidId].bidCreater = msg.sender;
        Bids[bidId].bidCreaterName = bidCreaterName;
        Bids[bidId].minBidAmount = minBidAmount;
        Bids[bidId].timestamp = block.timestamp;
        Bids[bidId].done = false;
        
        bids.push([uint2str(bidId), uint2str(block.timestamp), uint2str(minBidAmount), bidCreaterName]);
    }
    
    function submitBid(uint bidId) payable public {
        require(msg.sender != Bids[bidId].bidCreater);
        require(msg.value >= Bids[bidId].minBidAmount);
        require(Bids[bidId].done == false);
        
        Bids[bidId].bidCreater.transfer(msg.value);
        Bids[bidId].bidders.push(msg.sender);
        Bids[bidId].bids.push(msg.value);
    }

    function getAllAuc() public view returns (string[][] memory) {
        return bids;
    }
    
    function getAllBidPrice(uint bidId) public view returns (uint[] memory) {
        return (Bids[bidId].bids);
    }
    
    function getAllBidders(uint bidId) public view returns (address payable [] memory) {
        return (Bids[bidId].bidders);
    }
    
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
    
    function uint2str(uint _i) public returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}
