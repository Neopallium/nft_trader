#![cfg_attr(not(feature = "std"), no_std, no_main)]

extern crate alloc;

use polymesh_ink::*;

#[ink::contract]
mod nft_szn_24_trader {
  use alloc::{vec, vec::Vec};
  use alloc::collections::btree_set::BTreeSet;
  use ink::storage::Mapping;
  #[cfg(feature = "std")]
  use ink::storage::traits::StorageLayout;

  use crate::*;

  /// The contract error types.
  #[derive(Debug, scale::Encode, scale::Decode)]
  #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
  pub enum Error {
    /// PolymeshInk errors.
    PolymeshInk(PolymeshError),
    /// Scale decode failed.
    ScaleError,
    /// Contract hasn't been initialized.
    NotInitialized,
    /// Contract has already been initialized.
    AlreadyInitialized,
    /// Contract hasn't been closed.  User can only withdraw their NFTs and portfolios.
    ContractClosed,
    /// Invalid portfolio authorization.
    InvalidPortfolioAuthorization,
    /// The caller has already initialized a portfolio.
    AlreadyHavePortfolio,
    /// The caller doesn't have a portfolio yet.
    NoPortfolio,
    /// The seller's portfolio is missing.
    MissingPortfolio,
    /// An NFT isn't in the caller's portfolio.
    NotInPortfolio,
    /// The NFT is not for sale.
    NotForSale,
    /// The transferred value is too low (amount < sale price).
    TransferredValueTooLow,
    /// Failed to pay the seller.
    FailedToPaySeller,
    /// The caller must be the `admin` of the contract.
    NotAdmin,
  }

  impl From<PolymeshError> for Error {
    fn from(err: PolymeshError) -> Self {
      Self::PolymeshInk(err)
    }
  }

  impl From<PolymeshInkError> for Error {
    fn from(err: PolymeshInkError) -> Self {
      Self::PolymeshInk(err.into())
    }
  }

  /// The contract result type.
  pub type Result<T> = core::result::Result<T, Error>;

  /// Event emitted when a portfolio is added to the contract.
  #[ink(event)]
  pub struct PortfolioAdded {
    #[ink(topic)]
    portfolio: PortfolioId,
  }

  /// Event emitted when a portfolio is removed from the contract.
  #[ink(event)]
  pub struct PortfolioRemoved {
    #[ink(topic)]
    portfolio: PortfolioId,
  }

  /// Event emitted when NFTs are withdrawn from a portfolio.
  #[ink(event)]
  pub struct WithdrawnNFTs {
    #[ink(topic)]
    portfolio: PortfolioId,
    nfts: Vec<NFTId>,
  }

  /// Event emitted when NFTs are set for sale.
  #[ink(event)]
  pub struct NFTsForSale {
    #[ink(topic)]
    portfolio: PortfolioId,
    nfts: Vec<(NFTId, Balance)>,
  }

  /// Event emitted when NFT has been sold.
  #[ink(event)]
  pub struct NFTSold {
    #[ink(topic)]
    portfolio: PortfolioId,
    nft: NFTId,
    amount: Balance,
  }

  /// NFT sale details.
  #[derive(Debug, scale::Encode, scale::Decode, PartialEq, Eq)]
  #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, StorageLayout))]
  pub struct NftSaleDetails {
    /// The NFT owner's account to receive payment.
    pub account: AccountId,
    /// The NFT owner's DID.
    pub did: IdentityId,
    /// The NFT price.
    pub price: Balance,
  }

  /// NFT Portfolio details.
  #[derive(Debug, scale::Encode, scale::Decode, PartialEq, Eq)]
  #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, StorageLayout))]
  pub struct NftPortfolioDetails {
    /// The caller's portfolio id holding the NFTs to be sold.
    pub id: PortfolioId,
    /// NFTs for sale in this portfolio.
    pub nfts: BTreeSet<u64>,
  }

  impl NftPortfolioDetails {
    pub fn remove_nft(&mut self, nft: NFTId) -> Result<()> {
      if self.nfts.remove(&nft.0) {
        Ok(())
      } else {
        Err(Error::NotInPortfolio)
      }
    }
  }

  /// Contract state.
  #[derive(Debug, Default, scale::Encode, scale::Decode, PartialEq, Eq)]
  #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, StorageLayout))]
  pub enum ContractState {
    /// The contract has been deployed and needs to be initialized.
    #[default]
    Deployed,
    /// The contract has been initialized and is ready to be used.
    Initialized,
    /// The contract has been closed and can't be used.  Users are only allowed to withdraw
    /// their NFTs and portfolios.
    Closed,
  }

  impl ContractState {
    /// Ensure the contract is ready to be used.
    pub fn ensure_ready(&self) -> Result<()> {
      match self {
        Self::Initialized => Ok(()),
        _ => {
          return Err(Error::NotInitialized);
        }
      }
    }

    /// Withdraws are still allowed when the contract has been closed.
    pub fn ensure_withdraw(&self) -> Result<()> {
      match self {
        Self::Initialized => Ok(()),
        Self::Closed => Ok(()),
        _ => {
          return Err(Error::NotInitialized);
        }
      }
    }
  }

  /// Nft trading contract for NFTSZN2024.
  #[ink(storage)]
  #[derive(Default)]
  pub struct NftSzn24Trader {
    /// The contracts state (deployed, initialized, Closed).
    state: ContractState,
    /// The [`AccountId`] that deployed the contract.  Used to close the contract.
    admin: Option<AccountId>,
    /// NFT collection ticker.
    ticker: Ticker,
    /// Venue to help create settlements.
    venue: VenueId,
    /// Contract's identity.
    did: IdentityId,
    /// Custodial portfolios holding NFTS for sell.
    portfolios: Mapping<IdentityId, NftPortfolioDetails>,
    /// NFTs for sale.
    nft_sales: Mapping<NFTId, NftSaleDetails>,
  }

  impl NftSzn24Trader {
    /// Create NFT SZN 2024 trader contract for `ticker` collection.
    #[ink(constructor)]
    pub fn default() -> Result<Self> {
      Self::new(Ticker([
        0x4e, 0x46, 0x54, 0x53, 0x5a, 0x4e, 0x32, 0x30, 0x32, 0x34, 0x00, 0x00,
      ]))
    }

    /// Create NFT SZN 2024 trader contract for `ticker` collection.
    /// For testing.
    #[ink(constructor)]
    pub fn new(ticker: Ticker) -> Result<Self> {
      Ok(Self {
        ticker,
        admin: Some(Self::env().caller()),
        ..Default::default()
      })
    }

    /// Ensure the caller has a portfolio setup.
    fn ensure_has_portfolio(&self) -> Result<NftPortfolioDetails> {
      // Get the caller's identity.
      let caller_did = PolymeshInk::get_caller_did()?;
      self.portfolios.get(caller_did).ok_or(Error::NoPortfolio)
    }

    /// Ensure the caller doesn't have a portfolio already setup.
    fn ensure_no_portfolio(&self, did: IdentityId) -> Result<()> {
      if self.portfolios.get(did).is_some() {
        return Err(Error::AlreadyHavePortfolio);
      }
      Ok(())
    }

    /// Ensure the caller is the contract's admin.
    fn ensure_admin(&self) -> Result<()> {
      if self.admin == Some(Self::env().caller()) {
        Ok(())
      } else {
        Err(Error::NotAdmin)
      }
    }

    /// Ensure the caller has the NFT in their portfolio.
    fn ensure_nft_in_portfolio(
      &self,
      portfolio: PortfolioId,
      ids: impl IntoIterator<Item = NFTId>,
    ) -> Result<()> {
      for id in ids {
        let api = Api::new();
        let nft_portfolio = api.query().nft().nft_owner(self.ticker, id)?;
        if nft_portfolio != Some(portfolio) {
          return Err(Error::NotInPortfolio);
        }
      }
      Ok(())
    }

    #[ink(message)]
    pub fn init(&mut self) -> Result<()> {
      self.ensure_admin()?;
      if self.state == ContractState::Deployed {
        return Err(Error::AlreadyInitialized);
      }
      let api = PolymeshInk::new()?;

      // Update our identity id.
      self.did = PolymeshInk::get_our_did()?;
      // Create venue.
      self.venue = api.create_venue(VenueDetails(b"Contract Venue".to_vec()), VenueType::Other)?;
      self.state = ContractState::Initialized;
      Ok(())
    }

    /// The contract `admin` can close the contract.
    /// A closed contract will not allow any more trading, but will still allow
    /// users to withdraw the NFTs or portfolios.
    #[ink(message)]
    pub fn close(&mut self) -> Result<()> {
      self.ensure_admin()?;
      self.state = ContractState::Closed;
      Ok(())
    }

    #[ink(message)]
    pub fn venue(&self) -> Result<VenueId> {
      self.state.ensure_ready()?;
      Ok(self.venue)
    }

    #[ink(message)]
    pub fn contract_did(&self) -> Result<IdentityId> {
      self.state.ensure_ready()?;
      Ok(self.did)
    }

    // Remove NFTs from a portfolio and remove it from sale.
    fn remove_nfts<'a>(&mut self, mut portfolio: NftPortfolioDetails, nfts: impl IntoIterator<Item = &'a NFTId>) -> Result<PortfolioId> {
      let did = portfolio.id.did;
      for nft in nfts {
        portfolio.remove_nft(*nft)?;
        self.nft_sales.remove(nft);
      }
      // Update the portfolio details.
      self.portfolios.insert(did, &portfolio);
      Ok(portfolio.id)
    }

    #[ink(message)]
    /// Accept custody of a portfolio and give the caller some tokens.
    pub fn add_portfolio(&mut self, auth_id: u64, portfolio: PortfolioKind) -> Result<()> {
      self.state.ensure_ready()?;
      let api = PolymeshInk::new()?;
      // Accept portfolio custody and ensure we have custody.
      let portfolio_id = api.accept_portfolio_custody(auth_id, portfolio)?;
      let caller_did = portfolio_id.did;
      // Ensure the caller doesn't have a portfolio.
      self.ensure_no_portfolio(caller_did)?;
      // Save the caller's portfolio.
      self.portfolios.insert(caller_did, &NftPortfolioDetails {
        id: portfolio_id,
        nfts: Default::default(),
      });

      Self::env().emit_event(PortfolioAdded {
        portfolio: portfolio_id,
      });

      Ok(())
    }

    #[ink(message)]
    /// Return the caller's portfolio custodianship back to them.
    pub fn remove_portfolio(&mut self) -> Result<()> {
      self.state.ensure_withdraw()?;

      // Ensure the caller has a portfolio.
      let portfolio = self.ensure_has_portfolio()?;
      let caller_did = portfolio.id.did;

      let api = PolymeshInk::new()?;
      // Remove our custodianship.
      api.quit_portfolio_custody(portfolio.id)?;

      // Remove the portfolio.
      self.portfolios.remove(caller_did);
      // Remove the NFTs sale details.
      for id in portfolio.nfts {
        self.nft_sales.remove(NFTId(id));
      }

      Self::env().emit_event(PortfolioRemoved {
        portfolio: portfolio.id,
      });

      Ok(())
    }

    #[ink(message)]
    /// Allow the caller to withdrawal NFTs from the contract controlled portfolio.
    pub fn withdraw(&mut self, ids: Vec<NFTId>, dest: PortfolioKind) -> Result<()> {
      self.state.ensure_withdraw()?;

      // Ensure the caller has a portfolio.
      let caller_portfolio = self.ensure_has_portfolio()?;
      // Remove the NFTs from the caller's portfolio.
      let caller_portfolio = self.remove_nfts(caller_portfolio, &ids)?;

      let caller_did = caller_portfolio.did;
      let dest = PortfolioId {
        did: caller_did,
        kind: dest,
      };

      let api = PolymeshInk::new()?;
      // Move NFTs out of the contract controlled portfolio.
      api.move_portfolio_funds(
        caller_portfolio,
        dest,
        vec![Fund {
          description: FundDescription::NonFungible(NFTs {
            ticker: self.ticker,
            ids: ids.clone(),
          }),
          memo: None,
        }],
      )?;

      Self::env().emit_event(WithdrawnNFTs {
        portfolio: caller_portfolio,
        nfts: ids,
      });

      Ok(())
    }

    #[ink(message)]
    /// Mark NFTs for sale.
    ///
    /// Befor trying to call this method make sure you have done the following:
    ///   * Setup a portfolio with the contract.
    ///   * Make sure the NFTs are in that portfolio.
    pub fn nft_for_sell(&mut self, nfts: Vec<(NFTId, Balance)>) -> Result<()> {
      self.state.ensure_ready()?;

      // Ensure the caller has a portfolio.
      let mut caller_portfolio = self.ensure_has_portfolio()?;
      let caller_did = caller_portfolio.id.did;

      // Ensure the NFTs are in the caller's portfolio.
      self.ensure_nft_in_portfolio(caller_portfolio.id, nfts.iter().map(|(id, _)| *id))?;

      // Add the NFTs into the caller's portfolio details.
      for (id, _) in &nfts {
        caller_portfolio.nfts.insert(id.0);
      }
      // Update the seller's portfolio details.
      self.portfolios.insert(caller_did, &caller_portfolio);

      let account = Self::env().caller();
      for (id, price) in &nfts {
        self.nft_sales.insert(
          id,
          &NftSaleDetails {
            account,
            did: caller_did,
            price: *price,
          },
        );
      }

      Self::env().emit_event(NFTsForSale {
        portfolio: caller_portfolio.id,
        nfts,
      });

      Ok(())
    }

    fn transfer_nft(
      &self,
      sender: PortfolioId,
      receiver: PortfolioId,
      id: NFTId,
    ) -> Result<()> {
      let api = PolymeshInk::new()?;
      api.settlement_execute(
        self.venue,
        vec![Leg::NonFungible {
          sender,
          receiver,
          nfts: NFTs {
            ticker: self.ticker,
            ids: vec![id],
          }
        }],
        vec![sender, receiver],
      )?;
      Ok(())
    }

    #[ink(message, payable)]
    /// Buy an NFT by paying the sale price.
    ///
    /// Befor trying to call this method make sure you have done the following:
    ///   * Setup a portfolio with the contract.
    pub fn buy_nft(&mut self, nft: NFTId) -> Result<()> {
      self.state.ensure_ready()?;

      // Check if the NFT is for sale.
      let sale = self.nft_sales.take(nft).ok_or(Error::NotForSale)?;

      // Get the seller's portfolio.
      let seller_portfolio = self.portfolios.get(sale.did).ok_or(Error::MissingPortfolio)?;

      // Ensure the caller has paid the required amount.
      let amount = Self::env().transferred_value();
      if sale.price > amount {
        return Err(Error::TransferredValueTooLow);
      }

      // Ensure the caller has a portfolio.
      let caller_portfolio = self.ensure_has_portfolio()?.id;

      // Remove the NFT from the seller's portfolio.
      let seller_portfolio = self.remove_nfts(seller_portfolio, &[nft])?;

      // Transfer the NFT to the buyer.
      self.transfer_nft(seller_portfolio, caller_portfolio, nft)?;

      // Pay the seller.
      if Self::env().transfer(sale.account, amount).is_err() {
        return Err(Error::FailedToPaySeller);
      }

      Self::env().emit_event(NFTSold {
        portfolio: caller_portfolio,
        nft,
        amount,
      });

      Ok(())
    }
  }
}
