// SPDX-License-Identifier: MIT


pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";




contract CommonNFT is ERC721Enumerable, ReentrancyGuard, Ownable {

  mapping(uint256 => uint256) public stores;
  bytes4 private _INTERFACE_ID_ERC2981 = 0x2a55205a;
  uint256 public feeBase = 10000;
  uint256 public royaltyInBp = 1000;
  address public artist = address(this);


  event Set(address sender, bytes data, uint256 setVal);
  event Paid(address sender, uint256 value, bytes data);

  function toggleERC2981(bool _state) external {
    if(_state){
      _INTERFACE_ID_ERC2981 = 0x2a55205a;
    }else{
      _INTERFACE_ID_ERC2981 = 0x00000000;
    }

  }

  /**  @notice ERC165-compliancy: checks if the contract supports a given interface id
    *  @param interfaceId interfaceId to check against the supported interfaces
    */
  function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
      return
          interfaceId == type(IERC721Enumerable).interfaceId ||
          interfaceId == _INTERFACE_ID_ERC2981 ||
          super.supportsInterface(interfaceId);
  }

  function royaltyInfo(
        uint256 _tokenId,
        uint256 _salePrice
    ) public view returns (
        address receiver,
        uint256 royaltyAmount
    ) {
      receiver = artist;
      royaltyAmount = _salePrice * royaltyInBp / feeBase;
    }

  function tokenURI(uint256 _tokenId) override public pure returns (string memory) {
    string memory tokenIdStr = '0';
    if(_tokenId == 1){
      tokenIdStr = '1';
    }
    if(_tokenId == 2){
      tokenIdStr = '2';
    }
    if(_tokenId == 3){
      tokenIdStr = '3';
    }
    if(_tokenId == 4){
      tokenIdStr = '4';
    }
    return string(abi.encodePacked('https://www.miladymaker.net/milady/json/7292'));
  }

  function pureFunc() external pure returns(uint256) {
    return 456 + 43;//499
  }

  function getterFunc(uint256 _id) external view returns(uint256) {
    return stores[_id];
  }

  function setterFunc(uint256 _id, uint256 _val) external {
    stores[_id] = _val;
    emit Set(msg.sender, msg.data, stores[_id]);
  }

  function payableFunc() external payable returns(uint256) {
    emit Paid(msg.sender, msg.value, msg.data);
    return msg.value;
  }


  function mint() external nonReentrant {
    _safeMint(_msgSender(), totalSupply()+1);//start at 1
  }

  function setArtist(address _artist) external onlyOwner {
    artist = _artist;
  }


  constructor() ERC721("Common NFT", "CMMN") Ownable() {
  }

}
