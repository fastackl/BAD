// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.19;

import "../BytesLib.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



/** @title MissionControl Contract
  * @author @troyth
  * @notice Determines EET guardianship based on scoring and challenges
  */
contract MissionControl is Ownable {
  uint256 public _MINTPOINTS = 1;//score for a mint
  uint256 public _BURNPOINTS = 1;//score for a burn

  address public _eetContract;//EET contract address

  mapping(address => uint256) public _scores;//participant scores
  address[3] public _guardians;//the three guardians

  constructor() Ownable(){}

  modifier onlyEET {
    require(msg.sender == _eetContract, "Not auth");
    _;
  }

  /**
   * @dev Sets the EET contract that can update participant scores
   * @param _eet address of the EET contract
  */
  function setEET(address _eet) public onlyOwner {
    _eetContract = _eet;
  }

  /**
   * @dev Returns true if the participant is a guardian
   * @param _participant address of the participant
  */
  function isGuardian(address _participant) external view returns (bool){
    for(uint256 i = 0; i < 3; i++){
      if(_guardians[i] == _participant){
        return true;
      }
    }
  }

  /**
   * @dev Returns the score of a participant
   * @param _participant address of the participant
  */
  function getScore(address _participant) external view returns (uint256){
    return _scores[_participant];
  }

  /**
   * @dev Records the score as the result of a minted NFT
   * @param _eetTokenId not used
   * @param _msgSender not used
   * @param _mintPayload the address to credit with the score
  */
  function addMintPayload(uint256 _eetTokenId, address _msgSender, bytes memory _mintPayload) public onlyEET {
    address ref = BytesLib.toAddress(_mintPayload, 0);
    if(ref != address(0)){
      _scores[ref] = _scores[ref] + _MINTPOINTS;
    }
  }

  /**
   * @dev Records the score as the result of a burned NFT
   * @param _eetTokenId not used
   * @param _msgSender not used
   * @param _burnPayload the address to credit with the score
  */
  function addBurnPayload(uint256 _eetTokenId, address _msgSender, bytes memory _burnPayload) public onlyEET {
    address ref = BytesLib.toAddress(_burnPayload, 0);
    if(ref != address(0)){
      _scores[ref] = _scores[ref] + _BURNPOINTS;
    }
  }

  /**
   * @dev Allows a participant to challenge a particular guardian
   * @param _gIdx the index of the guardian to challenge in the _guardians array
   * @param _stake the amount of score at stake
  */
  function challenge(uint256 _gIdx, uint256 _stake, string memory _intention) public returns(bool success) {
    require(_scores[msg.sender] >= _stake, "Cannot risk more than you have");

    uint256 rand = _getRandomNumber(_intention);

    if(rand < 50){//challenge failed
      _scores[msg.sender] -= _stake;
    }else{//challenge succeeded
      if(_scores[_guardians[_gIdx]] > _stake){//guardian score reduced by stake
        _scores[_guardians[_gIdx]] -= _stake;
      }else{//guardian position lost to challenger
        _scores[_guardians[_gIdx]] = 0;
        _guardians[_gIdx] = msg.sender;
      }
    }
  }

  /**
   * @dev Returns a random number in [0,100) based on pseudorandomness and inputted intention
   * @param _intention string variable that salts the pseudorandom number
   */
  function _getRandomNumber(string memory _intention) internal view returns (uint256) {
    return uint256(
      keccak256(
        abi.encodePacked(
         block.prevrandao,
          block.timestamp,
          _intention
        )
      )
    ) % 100; // Use a suitable range
  }

}
