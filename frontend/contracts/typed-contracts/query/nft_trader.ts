/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { ApiPromise } from '@polkadot/api';
import type { GasLimit, GasLimitAndRequiredValue, Result } from '@727-ventures/typechain-types';
import type { QueryReturnType } from '@727-ventures/typechain-types';
import { queryJSON, queryOkJSON, handleReturnType } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/nft_trader';
import type * as ReturnTypes from '../types-returns/nft_trader';
import type BN from 'bn.js';
//@ts-ignore
import {ReturnNumber} from '@727-ventures/typechain-types';
import {getTypeDescription} from './../shared/utils';
import DATA_TYPE_DESCRIPTIONS from '../data/nft_trader.json';


export default class Methods {
	readonly __nativeContract : ContractPromise;
	readonly __apiPromise: ApiPromise;
	readonly __callerAddress : string;

	constructor(
		nativeContract : ContractPromise,
		nativeApi : ApiPromise,
		callerAddress : string,
	) {
		this.__nativeContract = nativeContract;
		this.__callerAddress = callerAddress;
		this.__apiPromise = nativeApi;
	}

	/**
	* init
	*
	* @returns { Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"init" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "init", [], __options , (result) => { return handleReturnType(result, getTypeDescription(10, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* close
	*
	* @returns { Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"close" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "close", [], __options , (result) => { return handleReturnType(result, getTypeDescription(10, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* createPortfolio
	*
	* @param { ArgumentTypes.PortfolioName } portfolioName,
	* @returns { Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"createPortfolio" (
		portfolioName: ArgumentTypes.PortfolioName,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "createPortfolio", [portfolioName], __options , (result) => { return handleReturnType(result, getTypeDescription(10, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* addPortfolio
	*
	* @param { (number | string | BN) } authId,
	* @param { ArgumentTypes.PortfolioNumber } portfolio,
	* @returns { Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"addPortfolio" (
		authId: (number | string | BN),
		portfolio: ArgumentTypes.PortfolioNumber,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "addPortfolio", [authId, portfolio], __options , (result) => { return handleReturnType(result, getTypeDescription(10, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* removePortfolio
	*
	* @returns { Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"removePortfolio" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "removePortfolio", [], __options , (result) => { return handleReturnType(result, getTypeDescription(10, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* withdraw
	*
	* @param { Array<ArgumentTypes.NftId> } ids,
	* @param { ArgumentTypes.PortfolioKind } dest,
	* @returns { Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"withdraw" (
		ids: Array<ArgumentTypes.NftId>,
		dest: ArgumentTypes.PortfolioKind,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "withdraw", [ids, dest], __options , (result) => { return handleReturnType(result, getTypeDescription(10, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* nftForSell
	*
	* @param { ArgumentTypes.BTreeMap } nfts,
	* @returns { Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"nftForSell" (
		nfts: ArgumentTypes.BTreeMap,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "nftForSell", [nfts], __options , (result) => { return handleReturnType(result, getTypeDescription(10, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* buyNft
	*
	* @param { ArgumentTypes.NftId } nft,
	* @returns { Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"buyNft" (
		nft: ArgumentTypes.NftId,
		__options ? : GasLimitAndRequiredValue,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "buyNft", [nft], __options , (result) => { return handleReturnType(result, getTypeDescription(10, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* venue
	*
	* @returns { Result<Result<ReturnTypes.VenueId, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"venue" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnTypes.VenueId, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "venue", [], __options , (result) => { return handleReturnType(result, getTypeDescription(30, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* contractDid
	*
	* @returns { Result<Result<ReturnTypes.IdentityId, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"contractDid" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnTypes.IdentityId, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "contractDid", [], __options , (result) => { return handleReturnType(result, getTypeDescription(33, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* ticker
	*
	* @returns { Result<Result<ReturnTypes.Ticker, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"ticker" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnTypes.Ticker, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "ticker", [], __options , (result) => { return handleReturnType(result, getTypeDescription(36, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* admin
	*
	* @returns { Result<Result<ReturnTypes.AccountId | null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"admin" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnTypes.AccountId | null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "admin", [], __options , (result) => { return handleReturnType(result, getTypeDescription(38, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* isOpen
	*
	* @returns { Result<Result<boolean, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"isOpen" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<boolean, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "isOpen", [], __options , (result) => { return handleReturnType(result, getTypeDescription(41, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* havePortfolio
	*
	* @returns { Result<Result<ReturnTypes.PortfolioId | null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"havePortfolio" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnTypes.PortfolioId | null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "havePortfolio", [], __options , (result) => { return handleReturnType(result, getTypeDescription(44, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* nfts
	*
	* @returns { Result<Result<ReturnTypes.BTreeSet, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"nfts" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnTypes.BTreeSet, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "nfts", [], __options , (result) => { return handleReturnType(result, getTypeDescription(48, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* nftSaleDetails
	*
	* @param { ArgumentTypes.NftId } nft,
	* @returns { Result<Result<ReturnTypes.NftSaleDetails | null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"nftSaleDetails" (
		nft: ArgumentTypes.NftId,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnTypes.NftSaleDetails | null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "nftSaleDetails", [nft], __options , (result) => { return handleReturnType(result, getTypeDescription(50, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* nftPrices
	*
	* @returns { Result<Result<Array<ReturnTypes.NftPrice>, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"nftPrices" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<Array<ReturnTypes.NftPrice>, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "nftPrices", [], __options , (result) => { return handleReturnType(result, getTypeDescription(54, DATA_TYPE_DESCRIPTIONS)); });
	}

}