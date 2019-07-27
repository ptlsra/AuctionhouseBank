//Auctionhouse bank API
var log4js = require('log4js');
var fs = require("fs");
var Web3 = require('web3');
var logger = log4js.getLogger('app.js');
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var cors = require('cors');
const app = express();
const path = require('path');

app.use(cors());
app.options("*",cors());


var pathval=__dirname + "";  // or directory name of ui folder
app.use(express.static(__dirname+"/UI/"));
app.set('views',pathval);

var pushProof = require("./pushProofToChain");
//var deployContract = require("./lib/DeployContract/deployContract.js");

let configRawData = fs.readFileSync('config.json');
let configData = JSON.parse(configRawData);
logger.level = configData.logLevel;
var appIp = configData.appIp;
var appPort = configData.appPort;
var mongodb_ip = configData.mongodb_ip;
var mongodb_port = configData.mongodb_port;
var web3Url = configData.web3Url;

var web3 = new Web3(new Web3.providers.HttpProvider(web3Url));
//var mongoUrl = "mongodb://localhost:27017/";
//logger.debug("mongourl : "+mongoUrl);

var bankdb;
var bankdbUrl = "mongodb://"+mongodb_ip+":"+mongodb_port+"/bankdb";
console.log(bankdbUrl);
MongoClient.connect(bankdbUrl, function(err, bankDBTemp) {
    bankdb = bankDBTemp;
});



var banktxndb;
var bankdbtxnUrl = "mongodb://"+mongodb_ip+":"+mongodb_port+"/banktxndb";
console.log(bankdbtxnUrl);
MongoClient.connect(bankdbtxnUrl, function(err, bankDBtxnTemp) {
    banktxndb = bankDBtxnTemp;
});




let balanceProofRawData = fs.readFileSync('./lib/DeployContract/BalanceProofContract.json');
let balanceProofContractData = JSON.parse(balanceProofRawData);
var balanceProofContractAddress = balanceProofContractData.contract_address;
var balanceProofSource = fs.readFileSync("./lib/DeployContract/BalanceProof.json");
var balanceProofContract = JSON.parse(balanceProofSource)["contracts"];
var balanceProofABI = JSON.parse(balanceProofContract["BalanceProof.sol:BalanceProof"].abi);
const deployedBalanceProofContract = web3.eth.contract(balanceProofABI).at(String(balanceProofContractAddress));






var setBalanceProofEvent;
setBalanceProofEvent =  deployedBalanceProofContract.SetBalanceProof({}, {fromBlock:'latest',toBlock:'latest'});
setBalanceProofEvent.watch(function(error, result) {
    logger.debug("SetBalanceProof event : "+JSON.stringify(result));

    let collectionName = (result.args.customerAddress);
    storeBankTx(collectionName, result);
});




/**
 * @function registerCustomer
 * 
 */
app.post('/registerCustomer', function(request, response){
    logger.info("registerCustomer");
    var firstName = request.query.firstName;
    var lastName = request.query.lastName;
    var dob = request.query.dob;
    var age = request.query.age;
    var city = request.query.city;
    var country = request.query.country;

    logger.debug("firstName : "+firstName);
    logger.debug("lastName : "+lastName);
    logger.debug("dob : "+dob);
    logger.debug("age : "+age);
    logger.debug("city : "+city);
    logger.debug("country : "+country);
    
    //create new account
    var walletAddress = web3.personal.newAccount("");
    logger.debug("walletAddress : "+walletAddress);

    var customerObj = {
        firstName:firstName,
        lastName:lastName,
        dob:dob,
        city:city,
        country:country,
        accountBalance:60000,
        walletAddress:walletAddress
    }

    var dir = './proofPackage/proofs/'+walletAddress;
    if (!fs.existsSync(dir)){
        logger.debug("created directory for address : "+walletAddress);
        fs.mkdirSync(dir);
    }

    logger.debug("customerObj : "+JSON.stringify(customerObj));

    bankdb.collection("customers").insertOne(customerObj, function(err, res) {
        if (err) throw err;
        logger.debug("customerObj inserted : "+res);
        response.send({
            "message":"success"
        });
    });
});


/**
 * @function generateProof
 * 
 */
app.post('/generateProof', function(request, response){
    logger.info("generateProof");

    try{
        pushProof.pushProof();
        response.send({
            "message":"success"
        });
    }catch(e){
        logger.error("error in generateProof : "+e);
    }
});


/**
 * @function getCustomerDetails
 * 
 * 
 */
app.get('/getCustomerDetails',function(request, response){
    logger.info("getCustomerDetails");
    var walletAddress = request.query.walletAddress;
    logger.debug("walletAddress : "+walletAddress);
    var query = {walletAddress:walletAddress};
    bankdb.collection("customers").find(query).toArray(function(err, result) {
        response.send(result[0]);
    });
});

/**
 * @function getAllCustomerDetails
 * 
 */
app.get('/getAllCustomerDetails',function(request, response){
    logger.info("getAllCustomerDetails");

    bankdb.collection("customers").find().toArray(function(err, result){
        response.send(result);
    });
});




/**
 * getTxnsForCustomer
 */
app.get('/getTxnsForCustomer', function(request, response){
    logger.info("getTxnsForCustomer");
    let emailAddress = request.query.emailAddress;

    //get accountAddress using emailAddress;
    var userDetailsArray = deployedBalanceProofContract['getUserDetails'](emailAddress);
    var customerAddress = userDetailsArray[0];

    banktxndb.collection(customerAddress).find().toArray(function(err, res){
        response.send(res);
    });

});


/**
 * getAllCustomerTxns
 */
app.get('/getAllCustomerTxns', function(request, response){
    logger.info("getAllCustomerTxns");
    var txList = [];
    banktxndb.listCollections().toArray(async function(err, customerList) {
        for (let index = 0; index < customerList.length ; index++){
            let collectionName = customerList[index];

            banktxndb.collection(collectionName.name).find().toArray(function(err, result){
                var customerRecord = {
                    customerAddress:collectionName.name,
                    txList:result
                }
                txList.push(customerRecord);
            });
        }
    });

    setTimeout(function(){
        response.send(txList);
    },1500);
});

app.get('/getProofValidity', function(request, response){
    logger.info("getProofValidity");

    bankdb.collection("proofvalidity").findOne({}, function(err, result) {
        if (err) throw err;
        logger.debug("result : "+result);

        response.send(result);
    });
});




function storeBankTx(collectionName, data){
    logger.info("createAuctionItemCollection");

    let transactionId = data.transactionHash;
    let txLog = data.args;
    let blockNumber = data.blockNumber;
    let block = web3.eth.getBlock(blockNumber);
    let timeStamp = block.timestamp;

    let record = {
        transactionId : transactionId,
        txLog : txLog,
        blockNumber : blockNumber,
        timeStamp : timeStamp
    }

    banktxndb.collection(collectionName).insertOne(record, function(err, res) {
        if (err) throw err;
        logger.debug("tx inserted into auctiondb ");
        logger.debug(" : "+res);
    });
}




//assuming app is express Object.
app.get('/index',function(req,res){
	res.sendFile(path.join(__dirname+'/UI/index.html'));
});


app.use('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    var message ={
        message:"API on auctionhouse bank"
    }
    res.send(message);
})


/**
 * application configuration
 */
app.listen(appPort, appIp,function () {
	logger.info("Auctionhouse bank server started and serving at IP : "+appIp+", Port : "+appPort);
});