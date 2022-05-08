export function marketplaceContract(test_number){
    let codeBody =  
        `(use-trait nft-trait .nft_trait_test_${test_number}.nft-trait)

        (define-data-var minimum-commission uint u100) ;; minimum commission 1% by default
        (define-data-var minimum-listing-price uint u1000000) ;; minimum listing price 1 STX
        
        
        (define-map escrow
          {nfts: principal, nft-id: uint}
          {price: uint, commission: uint, owner: principal, royalty-address: principal, royalty-percent: uint}
        )
        
        
        (define-constant contract-owner tx-sender)
        (define-constant err-payment-failed u1)
        (define-constant err-transfer-failed u2)
        (define-constant err-not-allowed u3)
        (define-constant err-duplicate-entry u4)
        (define-constant err-nft-not-found u5)
        (define-constant err-commission-or-price-too-low u6)
        (define-constant err-commission-payment-failed u7)
        (define-constant err-royalty-payment-failed u8)
        
        (define-read-only (get-listing (nfts <nft-trait>) (nft-id uint))
          (match (map-get? escrow {nfts: (contract-of nfts), nft-id: nft-id})
            nft-data 
            (ok nft-data)
            (err err-nft-not-found)
          )
        )
        
        (define-read-only (get-royalty-amount (contract principal) (nft-id uint))
          (match (map-get? escrow {nfts: contract, nft-id: nft-id})
            royalty-data
            (get royalty-percent royalty-data)
            u0)
        )
        
        (define-private (get-royalty (contract principal) (nft-id uint))
          (match (map-get? escrow {nfts: contract, nft-id: nft-id})
            royalty-data
            (let (
              (addr (get royalty-address royalty-data)) 
              (perc (get royalty-percent royalty-data))
            )
              {royalty-address: addr, royalty-percent: perc}
            )
            {royalty-address: contract-owner, royalty-percent: u0}
          )
        )
        
        (define-private (get-owner (nfts <nft-trait>) (nft-id uint))
          (contract-call? nfts get-owner nft-id)
        )
        
        (define-private (transfer-nft-to-escrow (nfts <nft-trait>) (nft-id uint))
          (begin
            (contract-call? nfts transfer nft-id tx-sender (as-contract tx-sender))
          )
        )
        
        
        
        (define-private (transfer-nft-from-escrow (nfts <nft-trait>) (nft-id uint))
          (let ((owner tx-sender))
            (begin
              (as-contract (contract-call? nfts transfer nft-id (as-contract tx-sender) owner))
            )
          )
        )
        
        (define-private (return-nft-from-escrow (nfts <nft-trait>) (nft-id uint))
          (match (map-get? escrow {nfts: (contract-of nfts), nft-id: nft-id})
            nft-data
            (let ((owner tx-sender))
              (begin
                (as-contract (contract-call? nfts transfer nft-id (as-contract tx-sender) (get owner nft-data)))
              )
            )
            (err err-nft-not-found)
          )
        )
        
        (define-public (list-asset (nfts <nft-trait>) (nft-id uint) (price uint) (commission uint))
          (begin
            (let ((nft-owner (unwrap! (unwrap-panic (get-owner nfts nft-id)) (err err-nft-not-found)))
                   (royalty (get-royalty (contract-of nfts) nft-id)))
               (if (and (>= commission (var-get minimum-commission)) (>= price (var-get minimum-listing-price)))
                (if (is-eq nft-owner tx-sender)
                 (if (map-insert escrow {nfts: (contract-of nfts), nft-id: nft-id}
                      {price: price, commission: commission, owner: nft-owner, royalty-address: (get royalty-address royalty), royalty-percent: (get royalty-percent royalty)})
                  (begin
                   (match (transfer-nft-to-escrow nfts nft-id)
                    success (begin
                        (ok true))
                    error (begin (print error) (err err-transfer-failed))))
                  (err err-duplicate-entry)
                 )
                 (err err-not-allowed)
                )
                (err err-commission-or-price-too-low)
               )
              )
          )
        )
        
        (define-public (unlist-asset (nfts <nft-trait>) (nft-id uint))
          (begin
            (match (map-get? escrow {nfts: (contract-of nfts), nft-id: nft-id})
              nft-data 
              (if (is-eq (get owner nft-data) tx-sender)
                  (match (transfer-nft-from-escrow nfts nft-id)
                     success (begin
                               (map-delete escrow {nfts: (contract-of nfts), nft-id: nft-id})
                               (ok true))
                     error (begin (print error) (err err-transfer-failed)))
                  (err err-not-allowed)
              )
              (err err-nft-not-found)
            )
          )
        )
        
        ;; tx sender has to send the required amount
        ;; tx sender receives NFT
        ;; owner gets paid out the amount minus commission
        ;; stxnft address gets paid out commission
        (define-public (purchase-asset (nfts <nft-trait>) (nft-id uint))
          (begin
            (match (map-get? escrow {nfts: (contract-of nfts), nft-id: nft-id})
              nft-data 
              (let ((price (get price nft-data)) 
                    (commission-amount (/ (* price (get commission nft-data)) u10000)) 
                    (royalty-amount (/ (* price (get royalty-percent nft-data)) u10000)) 
                    (to-owner-amount (- (- price commission-amount) royalty-amount))) 
                ;; first send the amount to the owner
                (match (stx-transfer? to-owner-amount tx-sender (get owner nft-data))
                  owner-success ;; sending money to owner succeeded
                  (match (stx-transfer? commission-amount tx-sender contract-owner)
                    commission-success ;; sending commission to contract owner succeeded
                      (if (> royalty-amount u0)
                        (match (stx-transfer? royalty-amount tx-sender (get royalty-address nft-data))
                          royalty-success ;; sending royalty to artist succeeded
                          (match (transfer-nft-from-escrow nfts nft-id)
                            transfer-success (begin 
                              (map-delete escrow {nfts: (contract-of nfts), nft-id: nft-id})
                              (ok true) ;; sending NFT to buyer succeeded
                            )
                            error (err err-transfer-failed)
                          )
                          error (err err-royalty-payment-failed)
                        )
                        (match (transfer-nft-from-escrow nfts nft-id)
                          transfer-success (begin 
                            (map-delete escrow {nfts: (contract-of nfts), nft-id: nft-id})
                            (ok true) ;; sending NFT to buyer succeeded
                          )
                          error (err err-transfer-failed)
                        )
                     )
                    error (err err-commission-payment-failed)
                  )
                  error (err err-payment-failed)
                )
              )
              (err err-nft-not-found)
            )
          )
        )
        
        (define-public (admin-unlist-asset (nfts <nft-trait>) (nft-id uint))
          (match (map-get? escrow {nfts: (contract-of nfts), nft-id: nft-id})
            nft-data 
            (if (is-eq contract-owner tx-sender)
                (match (return-nft-from-escrow nfts nft-id)
                   success (begin
                             (map-delete escrow {nfts: (contract-of nfts), nft-id: nft-id})
                             (ok true))
                   error (begin (print error) (err err-transfer-failed)))
                (err err-not-allowed)
            )
            (err err-nft-not-found)
          )
        )
        
        (define-public (set-minimum-commission (commission uint))
          (begin
            (asserts! (is-eq tx-sender contract-owner) (err err-not-allowed))
            (ok (var-set minimum-commission commission))
          )
        )`;

      return {
        codeBody,
        contractName: `marketplace_test_${test_number}`,
      }
}