#!/bin/bash
printUsage(){
    echo ""
    echo "generate-proof.sh generates witness file and proof."
    echo ""
    echo "USAGE : "
    echo "        ./generate-proof.sh [ARGS]"
    echo ""
    echo "ARGS : "
    echo "--help  - prints USAGE."
    echo "ARGS[1] - path to compiled code [.out file]."
    echo "ARGS[2] - path to witness file [witness file]."
    echo "ARGS[3] - path to proving key file."
    echo "ARGS[4] - path to meta information file[.inf]."
    echo "ARGS[5] - path to proof file."
    echo "ARGS[6] - compute-witness input (space separated)"
}

#source config
source ./config
if [  ${#@} > 6 ] ; then
witnessInput=${@:6}
${zokratespath}/zokrates compute-witness -i ${1} -o ${2} -a $witnessInput

${zokratespath}/zokrates generate-proof  -i  ${4}  -p ${3}  -w ${2}  > ${5}

python3 convertProofToJSON.py ${5} > ${5}.json
else
printUsage
fi
