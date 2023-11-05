// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "./Base64.sol";

/** @title GUAURI Contract
  * @author @0xAnimist
  * @notice First Onchain GIF, collaboration between Cai Guo-Qiang and Kanon
  */
library GUAURI {

  function render(bytes memory _gif, string memory _metadata) public pure returns (string memory) {
    string memory json = string(abi.encodePacked(
      '{"image": "data:image/gif;base64,',
      Base64.encode(_gif),
      '", ',
      _metadata,
      '}'
    ));

    return _pack(json);
  }//end render()


  function _pack(string memory _json) public pure returns (string memory) {
    string memory base64json = Base64.encode(bytes(_json));

    return string(abi.encodePacked('data:application/json;base64,', base64json));
  }



}
