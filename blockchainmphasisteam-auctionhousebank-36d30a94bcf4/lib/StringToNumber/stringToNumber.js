//Nodejs module to convert given string to ascii array.
var log4js = require('log4js');
var logger = log4js.getLogger('stringToNumber.js');
logger.level = "debug";

const stringToNumberFunction = function convertToAsciiArray(inputString){
    logger.info("convertToAsciiArray");
    logger.debug("inputString : "+inputString);

    var asciiString = "";
    for (let index = 0 ; index < inputString.length; index ++){
        asciiString = asciiString + inputString.charCodeAt(index);
    }
    logger.debug("asciiString : "+asciiString);
    return asciiString;
}

module.exports.stringToNumber = stringToNumberFunction;