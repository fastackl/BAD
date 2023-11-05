// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface iBondingCurve {
  function withdraw() external;
  function setGuardiansAddress(address feeRecipient1_) external;
  function setRoyaltyRecipientAddress(address feeRecipient2_) external;
  function getBalances(address _account) external view returns(uint256 ethBalance, uint256 k21Balance);
}

contract FeeRecipient is Ownable {
  address private _kanon;
  address private _cai;

  uint256 private _balanceKanonEth;
  uint256 private _balanceCaiEth;

  uint256 private _balanceKanonK21;
  uint256 private _balanceCaiK21;

  address public _k21TokenAddress;
  address public _BondingCurveAddress;

  constructor() Ownable(){}

  function setAddresses(address k21TokenAddress_, address BondingCurveAddress_, address cai_, address kanon_) external onlyOwner {
    _k21TokenAddress = k21TokenAddress_;
    _BondingCurveAddress = BondingCurveAddress_;
    _cai = cai_;
    _kanon = kanon_;
  }

  function getStateVars() external view onlyOwner returns(address, address, uint256, uint256) {
    return (_kanon, _cai, _balanceKanonEth, _balanceCaiEth);
  }

  function setGuardiansAddress(address _feeRecipient1) external onlyOwner {
    iBondingCurve(_BondingCurveAddress).setGuardiansAddress(_feeRecipient1);
  }

  function setRoyaltyRecipientAddress(address _feeRecipient2) external onlyOwner {
    iBondingCurve(_BondingCurveAddress).setRoyaltyRecipientAddress(_feeRecipient2);
  }


  receive() external payable {
    uint256 half = msg.value / 2;
    uint256 otherhalf = msg.value - half;

    _balanceKanonEth += half;
    _balanceCaiEth += otherhalf;
  }


  function _receiveK21(uint256 _localK21BalanceBefore, uint256 _k21Amount) internal {
    uint256 localK21BalanceAfter = IERC20(_k21TokenAddress).balanceOf(address(this));
    if(localK21BalanceAfter >= (_localK21BalanceBefore + _k21Amount)){
      uint256 halfK21 = _k21Amount / 2;
      uint256 otherhalfK21 = _k21Amount - halfK21;

      _balanceKanonK21 += halfK21;
      _balanceCaiK21 += otherhalfK21;
    }
  }

  function withdraw() external {
    require(msg.sender == _cai || msg.sender == _kanon, "not auth");

    uint256 localK21Balance = IERC20(_k21TokenAddress).balanceOf(address(this));

    (, uint256 k21Incoming) = iBondingCurve(_BondingCurveAddress).getBalances(address(this));
    iBondingCurve(_BondingCurveAddress).withdraw();

    //incoming Eth processed by receive()
    //process incoming K21
    _receiveK21(localK21Balance, k21Incoming);
  }

  function changeAddress(address _new) external {
    if(msg.sender == _kanon){
      _kanon = _new;
    }else if(msg.sender == _cai){
      _cai = _new;
    }
  }

  function claim() external {
    bool sent;
    if(msg.sender == _cai){
      //claim ETH
      if(_balanceCaiEth > 0){
        (sent,) = _cai.call{value: _balanceCaiEth, gas: gasleft()}("");
        require(sent, "Failed to send Ether");
        _balanceCaiEth = 0;
      }
      //claim K21
      if(_balanceCaiK21 > 0){
        sent = IERC20(_k21TokenAddress).transfer(_cai, _balanceCaiK21);
        require(sent, "Failed to send Cai K21");
        _balanceCaiK21 = 0;
      }
    }

    if(msg.sender == _kanon){
      //claim ETH
      if(_balanceKanonEth > 0){
        (sent,) = _kanon.call{value: _balanceKanonEth, gas: gasleft()}("");
        require(sent, "Failed to send Ether");
        _balanceKanonEth = 0;
      }
      //claim K21
      if(_balanceKanonK21 > 0){
        sent = IERC20(_k21TokenAddress).transfer(_kanon, _balanceKanonK21);
        require(sent, "Failed to send Kanon K21");
        _balanceKanonK21 = 0;
      }
    }
  }

  function emergencyWithdrawAll() external onlyOwner {
    uint256 amountEth = _balanceKanonEth + _balanceCaiEth;
    (bool sent,) = payable(msg.sender).call{value: amountEth, gas: gasleft()}("");
    require(sent, "Failed to send Ether");

    uint256 amountK21 = _balanceKanonK21 + _balanceCaiK21;
    sent = IERC20(_k21TokenAddress).transfer(msg.sender, amountK21);
    require(sent, "Failed to send K21");

    _balanceKanonEth = 0;
    _balanceCaiEth = 0;
    _balanceKanonK21 = 0;
    _balanceCaiK21 = 0;
  }
}
