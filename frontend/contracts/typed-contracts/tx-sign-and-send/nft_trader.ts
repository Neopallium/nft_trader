/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { ApiPromise } from '@polkadot/api';
import type { GasLimit, GasLimitAndRequiredValue, Result } from '@727-ventures/typechain-types';
import { txSignAndSend } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/nft_trader';
import type BN from 'bn.js';
// @ts-ignore
import type {EventRecord} from "@polkadot/api/submittable";
import {decodeEvents} from "../shared/utils";
import EVENT_DATA_TYPE_DESCRIPTIONS from '../event-data/nft_trader.json';


export default class Methods {
	readonly __nativeContract : ContractPromise;
	readonly __keyringPair : KeyringPair;
	readonly __apiPromise: ApiPromise;

	constructor(
		apiPromise: ApiPromise,
		nativeContract : ContractPromise,
		keyringPair : KeyringPair,
	) {
		this.__apiPromise = apiPromise;
		this.__nativeContract = nativeContract;
		this.__keyringPair = keyringPair;
	}

	/**
	* init
	*
	*/
	"init" (
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "init", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* close
	*
	*/
	"close" (
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "close", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* createPortfolio
	*
	* @param { ArgumentTypes.PortfolioName } portfolioName,
	*/
	"createPortfolio" (
		portfolioName: ArgumentTypes.PortfolioName,
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "createPortfolio", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [portfolioName], __options);
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
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "addPortfolio", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [authId, portfolio], __options);
	}

	/**
	* removePortfolio
	*
	*/
	"removePortfolio" (
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "removePortfolio", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
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
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "withdraw", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [ids, dest], __options);
	}

	/**
	* nftForSell
	*
	* @param { ArgumentTypes.BTreeMap } nfts,
	*/
	"nftForSell" (
		nfts: ArgumentTypes.BTreeMap,
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "nftForSell", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [nfts], __options);
	}

	/**
	* buyNft
	*
	* @param { ArgumentTypes.NftId } nft,
	*/
	"buyNft" (
		nft: ArgumentTypes.NftId,
		__options ? : GasLimitAndRequiredValue,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "buyNft", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [nft], __options);
	}

	/**
	* venue
	*
	*/
	"venue" (
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "venue", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* contractDid
	*
	*/
	"contractDid" (
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "contractDid", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* ticker
	*
	*/
	"ticker" (
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "ticker", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* admin
	*
	*/
	"admin" (
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "admin", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* isOpen
	*
	*/
	"isOpen" (
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "isOpen", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* havePortfolio
	*
	*/
	"havePortfolio" (
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "havePortfolio", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* nfts
	*
	*/
	"nfts" (
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "nfts", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* nftSaleDetails
	*
	* @param { ArgumentTypes.NftId } nft,
	*/
	"nftSaleDetails" (
		nft: ArgumentTypes.NftId,
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "nftSaleDetails", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [nft], __options);
	}

	/**
	* nftPrices
	*
	*/
	"nftPrices" (
		__options ? : GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "nftPrices", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

}