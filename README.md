A contract for trading `NFTSZN2024` NFTs on Polymesh.

Allows NFTs to be sold safely for POLYX.  The NFT transfer and POLYX transfer are done in
a single atomic transaction to ensure the seller get their POLYX and the buyer gets the NFT.

Sellers set the price they are willing to sell each NFT for.  Then buyers can pay that price to
receive the NFT.  The NFT stays in the seller's portfolio until the buyer pays for it.

## Build

Install [`cargo-contract`](https://github.com/paritytech/cargo-contract).
```
cargo install cargo-contract --force
```

Build the contract:
`cargo contract build --release`

Contract file needed for deployment `./target/ink/nft_szn_24_trader.contract`.

## Deployment and Setup

Using a child identity:
1. Upload and deploy the contract file `nft_szn_24_trader.contract`.
3. Move the contract to it's own child identity using `identity.createChildIdentity(<CONTRACT_ADDRESS>)` (must be called by the primary key).
4. Call the `init()` method on the contract.

## Usage

Each buyers and sellers need to create a portfolio with the contract.

