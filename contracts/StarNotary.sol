pragma solidity 0.5.0;

//Importing openzeppelin-solidity ERC-721 implemented Standard
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";


/** StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation */
contract StarNotary is ERC721Full, ERC721Mintable {

    // Star data
    struct Star {
        string name;
    }

    /**
       Initialise name and symbol properties through the constructor
       as per example on https://www.npmjs.com/package/openzeppelin-solidity
     */
    constructor() ERC721Full("StarNotary Token", "SUN") public {
    }

    // mapping the Star with the Owner Address
    mapping(uint256 => Star) public tokenIdToStarInfo;

    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSale;

    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public {
        // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name);
        // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar;
        // Creating in memory the Star -> tokenId mapping
        _mint(msg.sender, _tokenId);
        // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    /**
       Putting an Star for sale (Adding the star tokenid into the mapping starsForSale,
       first verify that the sender is the owner)
      */
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sell a Star you don't own");
        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You need to have enough Ether");
        _transferFrom(ownerAddress, msg.sender, _tokenId);
        // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
        address payable ownerAddressPayable = _makePayable(ownerAddress);
        // We need to make this conversion to be able to use transfer() function to transfer ethers
        ownerAddressPayable.transfer(starCost);
        if (msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    /**
      Get the Star (struct) and return its name property
      */
    function lookUptokenIdToStarInfo(uint _tokenId) public view returns (string memory) {
        return tokenIdToStarInfo[_tokenId].name;
    }

    /**
      * Exchanges two stars if the sender owns one of them
      */
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        // Verify that the sender owns one of the tokens
        if (msg.sender != ownerOf(_tokenId1) && msg.sender != ownerOf(_tokenId2)) {
            revert("You need to be the owner of one of the stars to exchange");
        }
        // Note: for this project we don't have to check for the price of the token (star)
        // Get addresses of the two token owners
        address _ownerTokenId1 = ownerOf(_tokenId1);
        address _ownerTokenId2 = ownerOf(_tokenId2);

        if (_ownerTokenId1 == _ownerTokenId2) {
            revert("You already own both stars");
        }

        // Exchange the star tokens
        _transferFrom(_ownerTokenId1, _ownerTokenId2, _tokenId1);
        _transferFrom(_ownerTokenId2, _ownerTokenId1, _tokenId2);
    }

    /**
       Transfer a sender's star to another address
      */
    function transferStar(address _to1, uint256 _tokenId) public {
        // Verify that the sender owns the star token
        if (msg.sender != ownerOf(_tokenId)) {
            revert("You need to be the owner of one of the stars to exchange");
        }
        _transferFrom(msg.sender, _to1, _tokenId);
    }

    // Function that allows you to convert an address into a payable address
    function _makePayable(address x) internal pure returns (address payable) {
        return address(uint160(x));
    }

}