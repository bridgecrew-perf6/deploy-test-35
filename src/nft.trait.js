export function nftTrait (test_number){
    let codeBody = 
        `(define-trait nft-trait
            (
                ;; Last token ID, limited to uint range
                (get-last-token-id () (response uint uint))
        
                ;; URI for metadata associated with the token 
                (get-token-uri (uint) (response (optional (string-ascii 256)) uint))
        
                ;; Owner of a given token identifier
                (get-owner (uint) (response (optional principal) uint))
        
                ;; Transfer from the sender to a new principal
                (transfer (uint principal principal) (response bool uint))
            )
        )`;

        return {
            codeBody,
            contractName: `nft_trait_test_${test_number}`,
        }
}