const chai = require('chai');
const assert = chai.assert;
const deployScript = require('../scripts/deploy.js');
const initializeScript = require('../scripts/initialize.js');
const { describe } = require('node:test');
const { ethers } = require("hardhat");
const { AddressZero } = ethers.constants;

let signers, Kanon, Jon, Nevermind, Safe, deployedContracts;

const count = 3;
let owners = [];
let queries = [];
let randomNumbers = [];
let queryhashes = [];
let encryptedStrings = [];
let payload = '0x';

function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

before(async function() {
    signers = await ethers.getSigners();
    [Kanon, Jon, Nevermind, Safe] = signers;

});

describe('Mint EET', function() {
    before(async function() {
        deployedContracts = await deployScript();
        await initializeScript();
/*
        console.log("\nKanon:" + Kanon.address);
        console.log("Jon:" + Jon.address);
        console.log("Nevermind:" + Nevermind.address);
        console.log("Safe:" + Safe.address);
*/
        for(let i = 0; i < count; i++){
          owners[i] = Kanon.address;
          queries[i] = randomString(15);
          console.log("\ni: " + i + " query: " + queries[i]);

          randomNumbers[i] = parseInt(Math.random()*1000000);
          encryptedStrings[i] = "foobar";
          queryhashes[i] = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(queries[i]));
        }

        let fee = await deployedContracts.BondingCurve.getFee(owners.length, AddressZero);
        console.log("Fee: " + fee);


        await deployedContracts.EET.connect(Jon).mint(owners, queryhashes, randomNumbers, "0x0000000000000000000000000000000000000000", encryptedStrings, Nevermind.address, {value: fee});

        console.log('\n\n\n');
        console.log('Running EET mint test ... ');
    });

    it('Should have minted 3 EET NFTs', async function() {
        assert.equal(await deployedContracts.EET.totalSupply(), 3, "3 nfts not minted");
    });

    it('Should have given Nevermind 3 points', async function() {
      let score = await deployedContracts.MissionControl.getScore(Nevermind.address);
      console.log("Nevermind score: " + score);
        assert.equal(await deployedContracts.MissionControl.getScore(Nevermind.address), 3, "Nevermind score wrong");
    });

    it('Should let Nevermind Challenge', async function() {
      let isG = false;
      while(!isG){
        await deployedContracts.MissionControl.connect(Nevermind).challenge(0, 1, "to Valhalla!");

        isG = await deployedContracts.MissionControl.isGuardian(Nevermind.address);

        if(isG){
          console.log("challenge succeeded");
        }else{
          console.log("challenge failed, retrying");
        }
      }

      assert.isTrue(isG);
    });


});
