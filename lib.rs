#![cfg_attr(not(feature = "std"), no_std, no_main)]

extern crate alloc;

use polymesh_ink::*;

#[ink::contract]
mod nft_trader {
  use alloc::collections::btree_set::BTreeSet;
  use alloc::collections::btree_map::BTreeMap;
  use alloc::{vec, vec::Vec};
  #[cfg(feature = "std")]
  use ink::storage::traits::StorageLayout;
  use ink::storage::Mapping;

  use crate::*;

  /// The contract error types.
  #[derive(Debug, scale::Encode, scale::Decode)]
  #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
  pub enum NftTraderError {
    /// PolymeshInk errors.
    PolymeshInk(PolymeshError),
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

  impl From<PolymeshError> for NftTraderError {
    fn from(err: PolymeshError) -> Self {
      Self::PolymeshInk(err)
    }
  }

  impl From<PolymeshInkError> for NftTraderError {
    fn from(err: PolymeshInkError) -> Self {
      Self::PolymeshInk(err.into())
    }
  }

  /// The contract result type.
  pub type Result<T> = core::result::Result<T, NftTraderError>;

  /// NFT ID.
  #[derive(
    Copy, Clone, Debug, Default, scale::Encode, scale::Decode, PartialEq, Eq, PartialOrd, Ord,
  )]
  #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, StorageLayout))]
  pub struct NftId(pub u64);

  impl NftId {
    pub fn nft(self) -> NFTId {
      NFTId(self.0)
    }
  }

  impl From<&NFTId> for NftId {
    fn from(id: &NFTId) -> Self {
      Self(id.0.into())
    }
  }

  impl From<NFTId> for NftId {
    fn from(id: NFTId) -> Self {
      Self(id.0.into())
    }
  }

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
    nfts: Vec<NftId>,
  }

  /// Event emitted when NFTs for sale prices is updated.
  #[ink(event)]
  pub struct NFTsForSale {
    #[ink(topic)]
    portfolio: PortfolioId,
    nfts: BTreeMap<NftId, Option<Balance>>,
  }

  /// Event emitted when NFT has been sold.
  #[ink(event)]
  pub struct NFTSold {
    #[ink(topic)]
    portfolio: PortfolioId,
    id: NftId,
    amount: Balance,
  }

  /// Nft price.
  #[derive(Debug, scale::Encode, scale::Decode, PartialEq, Eq)]
  #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, StorageLayout))]
  pub struct NftPrice {
    id: NftId,
    price: Balance,
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
    pub nfts: BTreeSet<NftId>,
  }

  impl NftPortfolioDetails {
    pub fn remove_nft(&mut self, nft: NftId) -> Result<()> {
      if self.nfts.remove(&nft) {
        Ok(())
      } else {
        Err(NftTraderError::NotInPortfolio)
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
        Self::Closed => {
          return Err(NftTraderError::ContractClosed);
        }
        _ => {
          return Err(NftTraderError::NotInitialized);
        }
      }
    }

    /// Withdraws are still allowed when the contract has been closed.
    pub fn ensure_withdraw(&self) -> Result<()> {
      match self {
        Self::Initialized => Ok(()),
        Self::Closed => Ok(()),
        _ => {
          return Err(NftTraderError::NotInitialized);
        }
      }
    }
  }

  /// Contract to trade NFTs on Polymesh.
  #[ink(storage)]
  #[derive(Default)]
  pub struct NftTrader {
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
    nft_sales: Mapping<NftId, NftSaleDetails>,
    /// The ids of all NFTs for sale.  Used to list details of NFTs.
    nfts: BTreeSet<NftId>,
  }

  impl NftTrader {
    /// Create NFT trader contract for `ticker` collection.
    /// For testing.
    #[ink(constructor)]
    pub fn new(ticker: Ticker) -> Result<Self> {
      Ok(Self {
        ticker,
        admin: Some(Self::env().caller()),
        ..Default::default()
      })
    }

    /// Called after deploying the contract to create the Venue.
    #[ink(message)]
    pub fn init(&mut self) -> Result<()> {
      self.ensure_admin()?;
      if self.state != ContractState::Deployed {
        return Err(NftTraderError::AlreadyInitialized);
      }
      let api = PolymeshInk::new()?;

      // Update our identity id.
      self.did = PolymeshInk::get_our_did()?;
      // Create venue.
      self.venue = api.create_venue(VenueDetails(b"NFT Trader Venue".to_vec()), VenueType::Other)?;
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

    /// Creates a portoflio controlled by the contract for the caller.
    ///
    /// Sellers should move the NFTs they want to sell into this portfolio.
    /// Buyers will receiver the NFTs into this portfolio when they buy an NFT.
    #[ink(message)]
    pub fn create_portfolio(&mut self, portfolio_name: PortfolioName) -> Result<()> {
      self.state.ensure_ready()?;

      // Ensure the caller doesn't have a portfolio.
      let caller_did = self.ensure_no_portfolio()?;

      let api = PolymeshInk::new()?;
      let portfolio_id = api.create_custody_portfolio(caller_did, portfolio_name)?;

      // Save the caller's portfolio.
      self.portfolios.insert(
        caller_did,
        &NftPortfolioDetails {
          id: portfolio_id,
          nfts: Default::default(),
        },
      );

      Self::env().emit_event(PortfolioAdded {
        portfolio: portfolio_id,
      });

      Ok(())
    }

    #[ink(message)]
    /// Accept custody of a portfolio.  Use this if you have already created a
    /// portfolio to hold the NFTs.
    ///
    /// Can't be used with the `Default` portfolio.  This is to prevent the user
    /// from locking themselves out of their `Default` portfolio.
    pub fn add_portfolio(&mut self, auth_id: u64, portfolio: PortfolioNumber) -> Result<()> {
      self.state.ensure_ready()?;

      // Ensure the caller doesn't have a portfolio.
      let caller_did = self.ensure_no_portfolio()?;

      let api = PolymeshInk::new()?;
      // Accept portfolio custody and ensure we have custody.
      let kind = PortfolioKind::User(portfolio);
      let portfolio_id = api.accept_portfolio_custody(auth_id, kind)?;
      if caller_did != portfolio_id.did {
        return Err(NftTraderError::InvalidPortfolioAuthorization);
      }

      // Save the caller's portfolio.
      self.portfolios.insert(
        caller_did,
        &NftPortfolioDetails {
          id: portfolio_id,
          nfts: Default::default(),
        },
      );

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
      for nft in portfolio.nfts {
        self.remove_nft(&nft);
      }

      Self::env().emit_event(PortfolioRemoved {
        portfolio: portfolio.id,
      });

      Ok(())
    }

    #[ink(message)]
    /// Allow the caller to withdrawal NFTs from the contract controlled portfolio.
    pub fn withdraw(&mut self, ids: Vec<NftId>, dest: PortfolioKind) -> Result<()> {
      self.state.ensure_withdraw()?;

      // Ensure the caller has a portfolio.
      let caller_portfolio = self.ensure_has_portfolio()?;
      // Remove the NFTs from the caller's portfolio.
      let caller_portfolio = self.remove_portfolio_nfts(caller_portfolio, &ids)?;

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
            ids: ids.iter().map(|id| id.nft()).collect(),
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
    pub fn nft_for_sell(&mut self, nfts: BTreeMap<NftId, Option<Balance>>) -> Result<()> {
      self.state.ensure_ready()?;

      // Ensure the caller has a portfolio.
      let mut caller_portfolio = self.ensure_has_portfolio()?;
      let caller_did = caller_portfolio.id.did;

      // Ensure the NFTs are in the caller's portfolio.
      self.ensure_nft_in_portfolio(caller_portfolio.id, nfts.iter().map(|(id, _)| *id))?;

      // Add the NFTs into the caller's portfolio details.
      for (id, price) in &nfts {
        if price.is_some() {
          caller_portfolio.nfts.insert(*id);
        } else {
          caller_portfolio.nfts.remove(id);
          self.remove_nft(id)
        }
      }
      // Update the seller's portfolio details.
      self.portfolios.insert(caller_did, &caller_portfolio);

      let account = Self::env().caller();
      for (id, price) in &nfts {
        if let Some(price) = price {
          self.nft_sales.insert(
            id,
            &NftSaleDetails {
              account,
              did: caller_did,
              price: *price,
            },
          );
          self.nfts.insert(*id);
        }
      }

      Self::env().emit_event(NFTsForSale {
        portfolio: caller_portfolio.id,
        nfts,
      });

      Ok(())
    }

    #[ink(message, payable)]
    /// Buy an NFT by paying the sale price.
    ///
    /// Befor trying to call this method make sure you have done the following:
    ///   * Setup a portfolio with the contract.
    pub fn buy_nft(&mut self, nft: NftId) -> Result<()> {
      self.state.ensure_ready()?;

      // Check if the NFT is for sale.
      let sale = self.nft_sales.take(nft).ok_or(NftTraderError::NotForSale)?;
      self.nfts.remove(&nft);

      // Get the seller's portfolio.
      let seller_portfolio = self
        .portfolios
        .get(sale.did)
        .ok_or(NftTraderError::MissingPortfolio)?;

      // Ensure the caller has paid the required amount.
      let amount = Self::env().transferred_value();
      if sale.price > amount {
        return Err(NftTraderError::TransferredValueTooLow);
      }

      // Ensure the caller has a portfolio.
      let caller_portfolio = self.ensure_has_portfolio()?.id;

      // Remove the NFT from the seller's portfolio.
      let seller_portfolio = self.remove_portfolio_nfts(seller_portfolio, &[nft])?;

      // Transfer the NFT to the buyer.
      self.transfer_nft(seller_portfolio, caller_portfolio, nft)?;

      // Pay the seller.
      if Self::env().transfer(sale.account, amount).is_err() {
        return Err(NftTraderError::FailedToPaySeller);
      }

      Self::env().emit_event(NFTSold {
        portfolio: caller_portfolio,
        id: nft,
        amount,
      });

      Ok(())
    }

    /// Contract Venue Id.
    #[ink(message)]
    pub fn venue(&self) -> Result<VenueId> {
      self.state.ensure_ready()?;
      Ok(self.venue)
    }

    /// Contract Identity.
    #[ink(message)]
    pub fn contract_did(&self) -> Result<IdentityId> {
      self.state.ensure_ready()?;
      Ok(self.did)
    }

    /// NFT collection ticker.
    #[ink(message)]
    pub fn ticker(&self) -> Result<Ticker> {
      self.state.ensure_ready()?;
      Ok(self.ticker)
    }

    /// Contract admin.
    #[ink(message)]
    pub fn admin(&self) -> Result<Option<AccountId>> {
      self.state.ensure_ready()?;
      Ok(self.admin)
    }

    /// Is the contract still open.
    #[ink(message)]
    pub fn is_open(&self) -> Result<bool> {
      Ok(self.state.ensure_ready().is_ok())
    }

    #[ink(message)]
    /// Returns the caller's protfolio.  Use this to check if the caller
    /// needs to add/create a portfolio.
    pub fn have_portfolio(&self) -> Result<Option<PortfolioId>> {
      // Get the caller's portfolio if they have one.
      Ok(self.ensure_has_portfolio().map(|p| p.id).ok())
    }

    #[ink(message)]
    /// Get all NFT IDs.
    pub fn nfts(&self) -> Result<BTreeSet<NftId>> {
      Ok(self.nfts.clone())
    }

    #[ink(message)]
    /// Get an NFT sale details if it is for sale.
    pub fn nft_sale_details(&self, nft: NftId) -> Result<Option<NftSaleDetails>> {
      Ok(self.nft_sales.get(nft))
    }

    #[ink(message)]
    /// Get all NFT prices.
    pub fn nft_prices(&self) -> Result<Vec<NftPrice>> {
      let mut available = Vec::new();
      for nft in &self.nfts {
        if let Some(sale) = self.nft_sales.get(nft) {
          available.push(NftPrice {
            id: *nft, price: sale.price
          });
        }
      }
      Ok(available)
    }

    /// Ensure the caller has a portfolio setup.
    fn ensure_has_portfolio(&self) -> Result<NftPortfolioDetails> {
      // Get the caller's identity.
      let caller_did = PolymeshInk::get_caller_did()?;
      self.portfolios.get(caller_did).ok_or(NftTraderError::NoPortfolio)
    }

    /// Ensure the caller doesn't have a portfolio already setup.
    fn ensure_no_portfolio(&self) -> Result<IdentityId> {
      // Get the caller's identity.
      let caller_did = PolymeshInk::get_caller_did()?;
      if self.portfolios.get(caller_did).is_some() {
        return Err(NftTraderError::AlreadyHavePortfolio);
      }
      Ok(caller_did)
    }

    /// Ensure the caller is the contract's admin.
    fn ensure_admin(&self) -> Result<()> {
      if self.admin == Some(Self::env().caller()) {
        Ok(())
      } else {
        Err(NftTraderError::NotAdmin)
      }
    }

    /// Ensure the caller has the NFT in their portfolio.
    fn ensure_nft_in_portfolio(
      &self,
      portfolio: PortfolioId,
      ids: impl IntoIterator<Item = NftId>,
    ) -> Result<()> {
      for id in ids {
        let api = Api::new();
        let nft_portfolio = api.query().nft().nft_owner(self.ticker, id.nft())?;
        if nft_portfolio != Some(portfolio) {
          return Err(NftTraderError::NotInPortfolio);
        }
      }
      Ok(())
    }

    /// Remove NFTs remove from sale.
    fn remove_nft(&mut self, nft: &NftId) {
      self.nft_sales.remove(nft);
      self.nfts.remove(nft);
    }

    /// Remove NFTs from a portfolio and remove it from sale.
    fn remove_portfolio_nfts<'a>(
      &mut self,
      mut portfolio: NftPortfolioDetails,
      nfts: impl IntoIterator<Item = &'a NftId>,
    ) -> Result<PortfolioId> {
      let did = portfolio.id.did;
      for nft in nfts {
        portfolio.remove_nft(*nft)?;
        self.remove_nft(nft);
      }
      // Update the portfolio details.
      self.portfolios.insert(did, &portfolio);
      Ok(portfolio.id)
    }

    /// Transfer a NFT.
    fn transfer_nft(
      &self,
      sender: PortfolioId,
      receiver: PortfolioId,
      id: NftId,
    ) -> Result<()> {
      let api = PolymeshInk::new()?;
      api.settlement_execute(
        self.venue,
        vec![Leg::NonFungible {
          sender,
          receiver,
          nfts: NFTs {
            ticker: self.ticker,
            ids: vec![id.nft()],
          },
        }],
        vec![sender, receiver],
      )?;
      Ok(())
    }
  }
}
