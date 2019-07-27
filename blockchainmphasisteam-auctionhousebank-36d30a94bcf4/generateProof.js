// wrapper to generate-proof.sh
var log4js = require('log4js');
var logger = log4js.getLogger('generateProof.js');
logger.level = "debug";
//var exec = require('child_process').exec, child;
const exec = require('await-exec');
//defaults [NOTE: To be read from file in future]

//defaults [NOTE: To be read from file in future]
var compiledCodePath = "proofPackage/code/"
var witnessPath = ""
var metaInfPath = "proofPackage/setup/"
var provingKeyPath = "proofPackage/setup/"
var proofPath = ""

/**
 * @function generateProof 
 * @param {*} compiledCode 
 * @param {*} witnessFile 
 * @param {*} provingKeyFile 
 * @param {*} metaInfFile 
 * @param {*} proofFile 
 */
const generateProofFunction = async function generateProof(compiledCode, witnessFile, provingKeyFile, metaInfFile, proofFile, inputString) {
    logger.info("generateProof");
    logger.debug("compiledCode : " + compiledCode);
    logger.debug("witnessFile : " + witnessFile);
    logger.debug("provingKeyFile : " + provingKeyFile);
    logger.debug("metaInfFile : " + metaInfFile);
    logger.debug("proofFile : " + proofFile);

    var temp =  'bash generateProof.sh'+
    ' ' + compiledCodePath+compiledCode+
    ' ' + witnessPath+witnessFile+
    ' ' + provingKeyPath+provingKeyFile+
    ' ' + metaInfPath+metaInfFile+
    ' ' + proofPath+proofFile+
    ' ' + inputString

    console.log(temp);
    // run script as bash
    await exec(
        'bash generateProof.sh'+
        ' ' + compiledCodePath+compiledCode+
        ' ' + witnessPath+witnessFile+
        ' ' + provingKeyPath+provingKeyFile+
        ' ' + metaInfPath+metaInfFile+
        ' ' + proofPath+proofFile+
        ' ' + inputString,
        options = {log:true});
}

//module.exports.generateProof = generateProofFunction;
//generateProofFunction("Auctionhouse.out","AuctionhouseWitness","AuctionhouseProving.key","Auctionhouse.inf","AuctionhouseProof3","60000");

module.exports.generateProof = generateProofFunction;
//generateProof("Test4.out","Test4_witness","Test4_proving.key","Test4.inf","Test4_proof");