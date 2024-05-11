import type {ReturnNumber} from "@727-ventures/typechain-types";
import type * as ReturnTypes from '../types-returns/nft_trader';

export interface PortfolioAdded {
	portfolio: ReturnTypes.PortfolioId;
}

export interface PortfolioRemoved {
	portfolio: ReturnTypes.PortfolioId;
}

export interface WithdrawnNFTs {
	portfolio: ReturnTypes.PortfolioId;
	nfts: Array<ReturnTypes.NftId>;
}

export interface NFTsForSale {
	portfolio: ReturnTypes.PortfolioId;
	nfts: ReturnTypes.BTreeMap;
}

export interface NFTSold {
	portfolio: ReturnTypes.PortfolioId;
	id: ReturnTypes.NftId;
	amount: ReturnNumber;
}

