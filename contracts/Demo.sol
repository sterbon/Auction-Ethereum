pragma solidity ^0.5.0;

contract SearchDPL {
    
  uint public dplCount = 0;
 
  
  mapping(uint => DPL) internal dpls;
  
  DPL[] public nameList;
  
  struct DPL {
    uint id;  
    string name;
    string country;
    string addr;
    string street;
    string city;
    bool searched;
  } 

  event DPLCreated(
    uint id,
    string name,
    string country,
    string addr,
    string street,
    string city,
    bool searched
  );


  event SearchCompleted(
    uint id,
    string name,
    string country,
    string addr,
    string street,
    string city,
    bool searched
  );

    constructor() public {
        
       createDPL( "Sonvir","India","A2,LiquidHub,DLF World Tech Park","Line 1","Gurgaon");
       createDPL( "Nikhil","Poland","A4,Capgemini,DLF World Tech Park","Line 2","Delhi");
       createDPL( "Praveen","India","A4,Capgemini,DLF World Tech Park","Line 2","Gurgoan");
       createDPL( "Nishtha","India","A4,Capgemini,DLF World Tech Park","Line 2","Delhi");
    }

  function createDPL(string memory _name, string memory _country, string memory _addr, string memory _street, string memory _city) public {
    
   
    
    // Require Name

    require(bytes(_name).length > 0);

    //Require Country Name

    require(bytes(_country).length > 0) ; 

    //Require Address

    require(bytes(_addr).length > 0) ; 

    //Require Street

    require(bytes(_city).length >= 0) ;

    //Require City Name

    require(bytes(_city).length > 0) ;  

    // Increment the product count

   dplCount  ++;

    // Create the DPL

    dpls[dplCount] = DPL(dplCount, _name, _country, _addr, _street, _city, false);
    

    // Trigger an event

    emit DPLCreated(dplCount, _name, _country, _addr, _street, _city, false);

  }

  function searchDpl(string memory _name) public view returns(string memory){

        //Fetch the DPL
    
         //DPL storage _dpl = dpls[_name] ; 
         for(uint i=1; i <= dplCount; i++) {
             
             if(keccak256(abi.encodePacked((dpls[i].name))) == keccak256(abi.encodePacked((_name))) ) {
                 
                return (dpls[i].name); 
             }
             
         }
  }
  
}
