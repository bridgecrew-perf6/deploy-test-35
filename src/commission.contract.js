export function commissionContract(test_number){
    let codeBody =  
        (`(define-public (pay (id uint) (price uint))
            (begin
            (try! (stx-transfer? (/ price u100) tx-sender 'ST356ASPHXK1EMKDZF5JBA36Z33DKSZD7R57C3NH0))
            (ok true)))
        `);

    return {
        codeBody,
        contractName: `commission_test_${test_number}`,
    }
}