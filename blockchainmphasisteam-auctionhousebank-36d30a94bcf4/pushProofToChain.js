var log4js = require('log4js');
var fs = require("fs");
var Web3 = require('web3');
var logger = log4js.getLogger('pushProofToChain.js');
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
const app = express();
var Web3 = require('web3');
var stringToNumber = require("./lib/StringToNumber/stringToNumber");

let configRawData = fs.readFileSync('config.json');
let configData = JSON.parse(configRawData);
logger.level = configData.logLevel;
var web3Url = configData.web3Url;
var mongodb_ip = configData.mongodb_ip;
var mongodb_port = configData.mongodb_port;

var web3 = new Web3(new Web3.providers.HttpProvider(web3Url));

var generateProof = require("./generateProof");
let rawdata = fs.readFileSync('./lib/DeployContract/BalanceProofContract.json');
let contractsData = JSON.parse(rawdata);
var balanceProofAddress = contractsData.contract_address;
var balanceProofSource = fs.readFileSync("./lib/DeployContract/BalanceProof.json");
var balanceContract = JSON.parse(balanceProofSource)["contracts"];
var balanceProofABI = JSON.parse(balanceContract["BalanceProof.sol:BalanceProof"].abi);
const deployedBalancedProofContract = web3.eth.contract(balanceProofABI).at(String(balanceProofAddress));



let auctionRawData = fs.readFileSync('./lib/DeployContract/AuctionContract.json');
let auctionContractData = JSON.parse(auctionRawData);
var auctionContractAddress = auctionContractData.contract_address;
var auctionSource = fs.readFileSync("./lib/DeployContract/Auction.json");
var auctionContract = JSON.parse(auctionSource)["contracts"];
var auctionABI = JSON.parse(auctionContract["Auction.sol:Auction"].abi);
const deployedAuctionContract = web3.eth.contract(auctionABI).at(String(auctionContractAddress));




var mongoUrl = "mongodb://"+mongodb_ip+":"+mongodb_port;

logger.info("balanceProofContract address : "+balanceProofAddress);


logger.debug("mongourl : "+mongoUrl);

var bankdb;
var bankdbUrl = "mongodb://"+mongodb_ip+":"+mongodb_port+"/bankdb";
console.log(bankdbUrl);
MongoClient.connect(bankdbUrl, function(err, bankDBTemp) {
    bankdb = bankDBTemp;
});

const pushProof = function pushProofToChain(){
    //getAllCustomer balances from the database
    logger.info("pushProofToChain");

    bankdb.collection("customers").find().toArray(function(err, result){
        //get balance from each record.
        //generate proof and push it to database and blockchain.
        pushProofData(result);
        logger.info("Updating timeStamp");
    });
    updateTimeStamp();
}

function updateTimeStamp(){
    logger.debug("updateTimeStamp");

    //current unix timestamp
    var unixTimestamp = Math.round((new Date()).getTime() / 1000);
    //valid for one week
    var validity = unixTimestamp+604800;
    var myquery = {prooftype:"auctionhouse"}

    var newvalues = {
        $set : {
          validity:validity,
          currentTimeStamp:unixTimestamp
        }
    }

    bankdb.collection("proofvalidity").update(myquery, newvalues,{upsert: true},function(err, res) {
        if (err) throw err;
        logger.debug("timestamp updated");
    });
}

async function pushProofData(result) {
    logger.info("pushProofData");
    logger.debug("starting loop : ");
    for (var index = 0; index < result.length; index++) {
        var customerRecord = result[index];
        logger.debug(JSON.stringify(customerRecord));
        let walletAddress = customerRecord.walletAddress;
        let witnessFile = "proofPackage/proofs/" + walletAddress + "/witness";
        let proofFile = "proofPackage/proofs/" + walletAddress + "/proof";
        let proofJsonPath = "proofPackage/proofs/" + walletAddress + "/proof.json";
        let firstName = stringToNumber.stringToNumber(customerRecord.firstName);
        let lastName = stringToNumber.stringToNumber(customerRecord.lastName);
        let blockchainAddress = stringToNumber.stringToNumber(walletAddress);
        let accountBalance = customerRecord.accountBalance;
        let emailAddress = customerRecord.emailAddress;

        logger.debug("firstName in numbers : "+firstName);
        logger.debug("lastName in numbers : "+lastName);
        logger.debug("blockchainAddress in numbers : "+blockchainAddress);
        logger.debug("accountBalance : "+accountBalance);
        logger.debug("emailAddress : "+emailAddress);

        let inputString = firstName+" "+lastName+" "+blockchainAddress+" "+accountBalance;
        //let inputString = firstName+" "+lastName+" "+"70000";
        //let inputString = "60000";
        await generateProof.generateProof("Auctionhouse.out", witnessFile, "AuctionhouseProving.key", "Auctionhouse.inf", proofFile, inputString);
        logger.debug("after await");
        // read proof.json and push it to BalanceProof contract
        //setTimeout(function(){
        var proofDataRaw = fs.readFileSync(proofJsonPath);
        let proofData = JSON.parse(proofDataRaw);

        logger.debug("proofData : " + JSON.stringify(proofData));
        logger.debug("walletAddress : " + walletAddress);
        web3.personal.unlockAccount(web3.eth.accounts[0], "");
        logger.debug("proofData.I : "+proofData.I);
        
        var regTxId  = deployedBalancedProofContract["registerUser"](emailAddress, walletAddress,{
            from: String(web3.eth.accounts[0]),
            gas: 4000000
        });

        logger.debug("regTxId : "+regTxId);
        
        /*
        var unixTimestamp = Math.round((new Date()).getTime() / 1000);
        logger.debug("current unix timestamp : "+unixTimestamp);
        unixTimestamp = unixTimestamp + 86400;

        var auctionTxId = deployedAuctionContract["setAuctionAuth"](walletAddress, "", unixTimestamp,{
            from:String(web3.eth.accounts[0]),
            gas: 4000000
        });

        logger.debug("auctionTxId : "+auctionTxId);
        */

        var txId = deployedBalancedProofContract["setBalanceProof"](
            walletAddress,
            proofData.A,
            proofData.A_p,
            proofData.B,
            proofData.B_p,
            proofData.C,
            proofData.C_p,
            proofData.H,
            proofData.K,
            proofData.I, {
                from: String(web3.eth.accounts[0]),
                gas: 4000000
        });
        logger.debug("txId : " + txId);
        //},3000);
    }
    logger.debug("calling pushProof method");
    //pushProof.call();
}

module.exports.pushProof = pushProof;

/*
setTimeout(function(){
pushProof.call();
},2000);
*/