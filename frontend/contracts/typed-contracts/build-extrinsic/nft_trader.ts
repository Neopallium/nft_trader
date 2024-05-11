/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { GasLimit, GasLimitAndRequiredValue } from '@727-ventures/typechain-types';
import { buildSubmittableExtrinsic } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/nft_trader';
import type BN from 'bn.js';
import type { ApiPromise } from '@polkadot/api';



export default class Methods {
	readonly __nativeContract : ContractPromise;
	readonly __apiPromise: ApiPromise;

	constructor(
		nativeContract : ContractPromise,
		apiPromise: ApiPromise,
	) {
		this.__nativeContract = nativeContract;
		this.__apiPromise = apiPromise;
	}
	/**
	 * init
	 *
	*/
	"init" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "init", [], __options);
	}

	/**
	 * close
	 *
	*/
	"close" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "close", [], __options);
	}

	/**
	 * createPortfolio
	 *
	 * @param { ArgumentTypes.PortfolioName } portfolioName,
	*/
	"createPortfolio" (
		portfolioName: ArgumentTypes.PortfolioName,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "createPortfolio", [portfolioName], __options);
	}

	/**
	 * addPortfolio
	 *
	 * @param { (number | string | BN) } authId,
	 * @param { ArgumentTypes.PortfolioNumber } portfolio,
	*/
	"addPortfolio" (
		authId: (number | string | BN),
		portfolio: ArgumentTypes.PortfolioNumber,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "addPortfolio", [authId, portfolio], __options);
	}

	/**
	 * removePortfolio
	 *
	*/
	"removePortfolio" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "removePortfolio", [], __options);
	}

	/**
	 * withdraw
	 *
	 * @param { Array<ArgumentTypes.NftId> } ids,
	 * @param { ArgumentTypes.PortfolioKind } dest,
	*/
	"withdraw" (
		ids: Array<ArgumentTypes.NftId>,
		dest: ArgumentTypes.PortfolioKind,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "withdraw", [ids, dest], __options);
	}

	/**
	 * nftForSell
	 *
	 * @param { ArgumentTypes.BTreeMap } nfts,
	*/
	"nftForSell" (
		nfts: ArgumentTypes.BTreeMap,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "nftForSell", [nfts], __options);
	}

	/**
	 * buyNft
	 *
	 * @param { ArgumentTypes.NftId } nft,
	*/
	"buyNft" (
		nft: ArgumentTypes.NftId,
		__options: GasLimitAndRequiredValue,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "buyNft", [nft], __options);
	}

	/**
	 * venue
	 *
	*/
	"venue" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "venue", [], __options);
	}

	/**
	 * contractDid
	 *
	*/
	"contractDid" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "contractDid", [], __options);
	}

	/**
	 * ticker
	 *
	*/
	"ticker" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "ticker", [], __options);
	}

	/**
	 * admin
	 *
	*/
	"admin" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "admin", [], __options);
	}

	/**
	 * isOpen
	 *
	*/
	"isOpen" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "isOpen", [], __options);
	}

	/**
	 * havePortfolio
	 *
	*/
	"havePortfolio" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "havePortfolio", [], __options);
	}

	/**
	 * nfts
	 *
	*/
	"nfts" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "nfts", [], __options);
	}

	/**
	 * nftSaleDetails
	 *
	 * @param { ArgumentTypes.NftId } nft,
	*/
	"nftSaleDetails" (
		nft: ArgumentTypes.NftId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "nftSaleDetails", [nft], __options);
	}

	/**
	 * nftPrices
	 *
	*/
	"nftPrices" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "nftPrices", [], __options);
	}

}