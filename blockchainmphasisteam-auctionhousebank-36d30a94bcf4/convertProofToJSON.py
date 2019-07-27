
#!/usr/bin/python3

import json
import sys

def filterString(data,filterOption):
    #print(data);
    filteredString = data[data.find(filterOption)+len(filterOption):]
    
    filteredString2 = filteredString.replace(' ','');
    filteredString3 = filteredString2.replace('[','');
    filteredString4 = filteredString3.replace(']','');
    filteredString5 = filteredString4.replace('\n','');
    filteredString6 = filteredString5.replace('Pairing.G1Point','');
    filteredString7 = filteredString6.replace('Pairing.G2Point','');
    filteredString8 = filteredString7.replace('(','');
    filteredString9 = filteredString8.replace(')','');
    filteredString10 = filteredString9.replace(';','');
    singleProofList = filteredString10.split(',');

    return singleProofList

def convertProofToJSON(pathToProofFile):
    data="";
    with open(pathToProofFile,"r") as proof:
        data = proof.read();
    startString = 'Proof:'
    endString = 'generate-proof successful: true'
    witnessInputStart="Public inputs:"
    witnessInputEnd="Private inputs:"
    pInputUnfiltered = data[data.find(witnessInputStart)+len(witnessInputStart):data.rfind(witnessInputEnd)];
    pInput = filterString(pInputUnfiltered, "");
    reqPInput = pInput[1:];
    reqPInput[3] = 1;

    #find string between startString and endString
    proofData = data[data.find(startString)+len(startString):data.rfind(endString)];
    proofList = proofData.splitlines();
    _A = filterString(proofList[1],"A = ");
    _A_p = filterString(proofList[2],"A p = ");
    _B = filterString(proofList[3],"B = ");
    _B_firstArray = list();
    _B_firstArray.append(_B[0]);
    _B_firstArray.append(_B[1]);

    _B_secondArray = list();
    _B_secondArray.append(_B[2]);
    _B_secondArray.append(_B[3]);

    _B_finalArray  = list();
    _B_finalArray.append(_B_firstArray);
    _B_finalArray.append(_B_secondArray);

    _B_p = filterString(proofList[4],"B p = ");
    _C = filterString(proofList[5],"C = ");
    _C_p = filterString(proofList[6],"C p = ");
    _H = filterString(proofList[7],"H = ");
    _K = filterString(proofList[8],"K = ");

    proofJSON = {
        "A":_A,
        "A_p":_A_p,
        "B":_B_finalArray,
        "B_p":_B_p,
        "C":_C,
        "C_p":_C_p,
        "H":_H,
        "K":_K,
        "I":reqPInput
    }

    print(json.dumps(proofJSON));


cmdInput = sys.argv;

convertProofToJSON(cmdInput[1]);