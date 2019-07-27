var log4js = require('log4js');
var logger = log4js.getLogger('registerCustomers.js');
var MongoClient = require('mongodb').MongoClient;
var Web3 = require('web3');
var fs = require("fs");

let configRawData = fs.readFileSync('config.json');
let configData = JSON.parse(configRawData);
logger.level = configData.logLevel;
var mongodb_ip = configData.mongodb_ip;
var mongodb_port = configData.mongodb_port;
var web3Url = configData.web3Url;

var web3 = new Web3(new Web3.providers.HttpProvider(web3Url));

var bankdb;
var bankdbUrl = "mongodb://"+mongodb_ip+":"+mongodb_port+"/bankdb";
console.log(bankdbUrl);
MongoClient.connect(bankdbUrl, function(err, bankDBTemp) {
    bankdb = bankDBTemp;
});

function createProofValidityCollection() {
    logger.info("createProofValidityCollection");
    let record = {
        prooftype:"auctionhouse",
        validity:0,
        currentTimeStamp:0
    }

    bankdb.collection("proofvalidity").insertOne(record, function (err, res) {
        if (err) throw err;
        logger.debug("proofvalidity : " + res);
    });
}

/**
 * @function registerCustomers function to register customers in bulk
 * 
 */
function registerCustomers(){
    logger.info("registerCustomers");
    //read customerData.json
    let customerListRawData = fs.readFileSync('customerData.json');
    let customerData = JSON.parse(customerListRawData); 

    for(let index = 0 ; index < customerData.length; index ++){
        let customerObject = customerData[index];
        logger.debug("customerObject  at index "+index+" : "+JSON.stringify(customerObject));

        var walletAddress = web3.personal.newAccount("");
        logger.debug("walletAddress : "+walletAddress);
        logger.debug("unlocking account ");
        web3.personal.unlockAccount(web3.eth.accounts[0], "");
        web3.eth.sendTransaction({from: web3.eth.accounts[0], to: walletAddress, value:  web3.toWei("3", "ether")});
        var dir = './proofPackage/proofs/'+walletAddress;

        if (!fs.existsSync(dir)){
            logger.debug("created directory for address : "+walletAddress);
            fs.mkdirSync(dir);
        }else{
            logger.debug("directory already exists for walletAddress : "+walletAddress);
        }

        let record = {
            firstName:customerObject.firstName,
            lastName:customerObject.lastName,
            dob:customerObject.dob,
            city:customerObject.city,
            country:customerObject.country,
            accountBalance:customerObject.accountBalance,
            emailAddress:customerObject.emailAddress,
            walletAddress:walletAddress,
        }

        bankdb.collection("customers").insertOne(record, function(err, res) {
            if (err) throw err;
            logger.debug("customerObj inserted : "+res);
        });
    }
}

setTimeout(function(){
    registerCustomers();
    createProofValidityCollection();
},2000);
