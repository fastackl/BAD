// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "./BytesLib.sol";

/** @title CellularAutomata Contract
  * @author @0xAnimist
  * @notice First Onchain GIF, collaboration between Cai Guo-Qiang and Kanon
  */
library CellularAutomata {

  //ideas: the rules array could be a stack (eg a 3d array?) that could push and pop rules?
  function updateRule(uint8[9][2] memory _rules, uint256 _neighbors, bool _death, uint8 _aliveIndex, uint8 _deadIndex) internal pure returns (uint8[9][2] memory rules) {
    //current algorithm: LIFO
    if(_death){
      _rules[1][_neighbors] = _deadIndex;
    }else{
      _rules[0][_neighbors] = _aliveIndex;
    }
    return _rules;
  }

  //because every neighbor condition may not be accounted for, must initialize the rule set in full
  //here, I initialize with the Game of Life rule set
  function initializeRules(uint8 _aliveIndex, uint8 _deadIndex) internal pure returns(uint8[9][2] memory rules) {
    return [
      [_deadIndex,_deadIndex,_deadIndex,_aliveIndex,_deadIndex,_deadIndex,_deadIndex,_deadIndex,_deadIndex],//if currently dead
      [_deadIndex,_deadIndex,_aliveIndex,_aliveIndex,_deadIndex,_deadIndex,_deadIndex,_deadIndex,_deadIndex]//if currently alive
    ];
  }

  // assumes a four-color matrix where index 0 and 3 correspond to Hexagram change lines
  function decryptRules(uint8[][] memory _im) public pure returns(uint8[9][2] memory rules) {
    uint256 neighbors;
    uint8[] memory neighborIndices = new uint8[](1);
    uint8 alive = 2;//yin is "alive"
    uint8 dead = 1;//yang is "dead"
    uint8 death = 0;
    uint8 birth = 3;
    neighborIndices[0] = alive;

    rules = initializeRules(alive, dead);

    for(uint256 i = 0; i < _im.length; i++){
      for(uint256 j = 0; j < _im[i].length; j++){
        if(_im[i][j] == death || _im[i][j] == birth){
          neighbors = calculateNeighbors(_im, i, j, neighborIndices);
          rules = updateRule(rules, neighbors, (_im[i][j] == 0), alive, dead);
        }
      }
    }
  }

  /// @param _rules the index of the lowest order array is the number of neighbors (from 0-8), the value is the pixel value of
  /// the next frame (1 == living; 0 == dead). The highest order of the 2D array is whether the current cell is dead (0) or living (1)
  function next(uint8[][] memory _im, uint8[9][2] memory _rules, uint8[] memory _neighborIndices, uint8 _aliveIndex, uint8 _deadIndex) public pure returns(uint8[][] memory im) {
    im = new uint8[][](_im.length);
    for(uint256 i = 0; i < _im.length; i++){
      im[i] = new uint8[](_im[i].length);
      for(uint256 j = 0; j < _im[0].length; j++){
        uint256 neighbors = calculateNeighbors(_im, i, j, _neighborIndices);
        if(_im[i][j] == _aliveIndex){
          im[i][j] = _rules[1][neighbors] == 1 ? _aliveIndex : _deadIndex;
        }else{
          im[i][j] = _rules[0][neighbors] == 1 ? _aliveIndex : _deadIndex;
        }
      }
    }
  }


  function life(uint8[][] memory _im, uint8 _aliveIndex, uint8 _deadIndex) public pure returns(uint8[][] memory im) {
    uint8[9][2] memory rulesOfLife = [
      [0,0,0,1,0,0,0,0,0],//if currently dead
      [0,0,1,1,0,0,0,0,0]//if currently alive
    ];

    uint8[] memory neighborIndices = new uint8[](1);
    neighborIndices[0] = _aliveIndex;

    return next(_im, rulesOfLife, neighborIndices, _aliveIndex, _deadIndex);
  }

  function equalsColor(uint8 _sample, uint8[] memory _colors) internal pure returns(bool equals) {
    for(uint256 i = 0; i < _colors.length; i++){
      if(_sample == _colors[i]){
        return true;
      }
    }
  }

  /// @param _colors the colors to count (ie. the colors of living cells)
  function calculateNeighbors(uint8[][] memory _im, uint256 _x, uint256 _y, uint8[] memory _colors) public pure returns(uint256 neighbors) {
    uint256 ww = _im.length;
    uint256 hh = _im[0].length;

    //count neighbors in top row
    if(_y != 0){
      //top left corner
      if(_x != 0){
        if(equalsColor(_im[_x-1][_y-1], _colors)){
          neighbors++;
        }
      }

      //top
      if(equalsColor(_im[_x][_y-1], _colors)){
        neighbors++;
      }

      //top right corner
      if(_x != (ww-1)){
        if(equalsColor(_im[_x+1][_y-1], _colors)){
          neighbors++;
        }
      }
    }//end top row

    //count neighbors in bottom row
    if(_y != (hh-1)){
      //bottom left corner
      if(_x != 0){
        if(equalsColor(_im[_x-1][_y+1], _colors)){
          neighbors++;
        }
      }

      //bottom
      if(equalsColor(_im[_x][_y+1], _colors)){
        neighbors++;
      }

      //bottom right corner
      if(_x != (ww-1)){
        if(equalsColor(_im[_x+1][_y+1], _colors)){
          neighbors++;
        }
      }
    }

    //left
    if(_x != 0){
      if(equalsColor(_im[_x-1][_y], _colors)){
        neighbors++;
      }
    }

    //right
    if(_x != (ww-1)){
      if(equalsColor(_im[_x+1][_y], _colors)){
        neighbors++;
      }
    }
  }//end calculateNeighbors


}//end CellularAutomata
