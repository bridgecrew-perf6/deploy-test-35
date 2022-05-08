export function commissionTrait(test_number){
    let codeBody = 
        `(define-trait commission
            ((pay (uint uint) (response bool uint))))`;

    return {
        codeBody,
        contractName: `commission_trait_test_${test_number}`,
    }
}