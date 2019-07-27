pragma solidity ^0.4.22;

contract BalanceProof{
    
    /**
     * Balance structure to maintain balance proof 
     */
    struct Balance{
        address customerAddress;
        uint[2] a;
        uint[2] a_p;
        uint[2][2] b;
        uint[2] b_p;
        uint[2] c;
        uint[2] c_p;
        uint[2] h;
        uint[2] k;
        uint[4] input;
    }
    
    //mappings
    mapping(address  => Balance) balanceProof;
    
    event SetBalanceProof(
        address customerAddress,
        uint[2] _a, 
        uint[2] _a_p,
        uint[2][2] _b,
        uint[2] _b_p,
        uint[2] _c,
        uint[2] _c_p,
        uint[2] _h,
        uint[2] _k,
        uint[2] _input
    );
    
    /**
     * setBalanceProof
     * @param customerAddress customer blockchain address 
     */
    function setBalanceProof(
        address customerAddress,
        uint[2] _a,
        uint[2] _a_p,
        uint[2][2] _b,
        uint[2] _b_p,
        uint[2] _c,
        uint[2] _c_p,
        uint[2] _h,
        uint[2] _k,
        uint[2] _input
    )public{
    
        
        balanceProof[customerAddress] = Balance({
            customerAddress : customerAddress,
            a : _a,
            a_p : _a_p,
            b : _b,
            b_p : _b_p,
            c : _c,
            c_p : _c_p,
            h : _h,
            k : _k,
            input : _input
        });
        
        emit SetBalanceProof(
            customerAddress,
            _a,
            _a_p,
            _b,
            _b_p,
            _c,
            _c_p,
            _h,
            _k,
            _input
        );
        
    }

    
    function getFirstBalanceProof(address customerAddress) public view returns(
            uint[2],
            uint[2],
            uint[2][2],
            uint[2],
            uint[2],
            uint[2]
        ){
        return (
        balanceProof[customerAddress].a,
        balanceProof[customerAddress].a_p,
        balanceProof[customerAddress].b,
        balanceProof[customerAddress].b_p,
        balanceProof[customerAddress].c,
        balanceProof[customerAddress].c_p
        );
    }
        
        
    function getSecondBalanceProof(address customerAddress) public  view returns(
            uint[2],
            uint[2],
            uint[2]
        ){
        return (
        balanceProof[customerAddress].h,
        balanceProof[customerAddress].k,
        balanceProof[customerAddress].input
        );
    }
    
}
