/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { ApiPromise } from '@polkadot/api';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { GasLimit, GasLimitAndRequiredValue, Result } from '@727-ventures/typechain-types';
import type { QueryReturnType } from '@727-ventures/typechain-types';
import { queryOkJSON, queryJSON, handleReturnType } from '@727-ventures/typechain-types';
import { txSignAndSend } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/nft_trader';
import type * as ReturnTypes from '../types-returns/nft_trader';
import type BN from 'bn.js';
//@ts-ignore
import {ReturnNumber} from '@727-ventures/typechain-types';
import {getTypeDescription} from './../shared/utils';
// @ts-ignore
import type {EventRecord} from "@polkadot/api/submittable";
import {decodeEvents} from "../shared/utils";
import DATA_TYPE_DESCRIPTIONS from '../data/nft_trader.json';
import EVENT_DATA_TYPE_DESCRIPTIONS from '../event-data/nft_trader.json';


export default class Methods {
	readonly __nativeContract : ContractPromise;
	readonly __keyringPair : KeyringPair;
	readonly __callerAddress : string;
	readonly __apiPromise: ApiPromise;

	constructor(
		apiPromise : ApiPromise,
		nativeContract : ContractPromise,
		keyringPair : KeyringPair,
	) {
		this.__apiPromise = apiPromise;
		this.__nativeContract = nativeContract;
		this.__keyringPair = keyringPair;
		this.__callerAddress = keyringPair.address;
	}

	/**
	* init
	*
	* @returns { void }
	*/
	"init" (
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "init", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* close
	*
	* @returns { void }
	*/
	"close" (
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "close", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* createPortfolio
	*
	* @param { ArgumentTypes.PortfolioName } portfolioName,
	* @returns { void }
	*/
	"createPortfolio" (
		portfolioName: ArgumentTypes.PortfolioName,
		__options: GasLimit,
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
	* @returns { void }
	*/
	"addPortfolio" (
		authId: (number | string | BN),
		portfolio: ArgumentTypes.PortfolioNumber,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "addPortfolio", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [authId, portfolio], __options);
	}

	/**
	* removePortfolio
	*
	* @returns { void }
	*/
	"removePortfolio" (
		__options: GasLimit,
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
	* @returns { void }
	*/
	"withdraw" (
		ids: Array<ArgumentTypes.NftId>,
		dest: ArgumentTypes.PortfolioKind,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "withdraw", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [ids, dest], __options);
	}

	/**
	* nftForSell
	*
	* @param { ArgumentTypes.BTreeMap } nfts,
	* @returns { void }
	*/
	"nftForSell" (
		nfts: ArgumentTypes.BTreeMap,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "nftForSell", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [nfts], __options);
	}

	/**
	* buyNft
	*
	* @param { ArgumentTypes.NftId } nft,
	* @returns { void }
	*/
	"buyNft" (
		nft: ArgumentTypes.NftId,
		__options: GasLimitAndRequiredValue,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "buyNft", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [nft], __options);
	}

	/**
	* venue
	*
	* @returns { Result<Result<ReturnTypes.VenueId, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"venue" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnTypes.VenueId, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "venue", [], __options, (result) => { return handleReturnType(result, getTypeDescription(30, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* contractDid
	*
	* @returns { Result<Result<ReturnTypes.IdentityId, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"contractDid" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnTypes.IdentityId, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "contractDid", [], __options, (result) => { return handleReturnType(result, getTypeDescription(33, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* ticker
	*
	* @returns { Result<Result<ReturnTypes.Ticker, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"ticker" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnTypes.Ticker, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "ticker", [], __options, (result) => { return handleReturnType(result, getTypeDescription(36, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* admin
	*
	* @returns { Result<Result<ReturnTypes.AccountId | null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"admin" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnTypes.AccountId | null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "admin", [], __options, (result) => { return handleReturnType(result, getTypeDescription(38, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* isOpen
	*
	* @returns { Result<Result<boolean, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"isOpen" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<boolean, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "isOpen", [], __options, (result) => { return handleReturnType(result, getTypeDescription(41, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* havePortfolio
	*
	* @returns { Result<Result<ReturnTypes.PortfolioId | null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"havePortfolio" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnTypes.PortfolioId | null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "havePortfolio", [], __options, (result) => { return handleReturnType(result, getTypeDescription(44, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* nfts
	*
	* @returns { Result<Result<ReturnTypes.BTreeSet, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"nfts" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnTypes.BTreeSet, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "nfts", [], __options, (result) => { return handleReturnType(result, getTypeDescription(48, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* nftSaleDetails
	*
	* @param { ArgumentTypes.NftId } nft,
	* @returns { Result<Result<ReturnTypes.NftSaleDetails | null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"nftSaleDetails" (
		nft: ArgumentTypes.NftId,
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnTypes.NftSaleDetails | null, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "nftSaleDetails", [nft], __options, (result) => { return handleReturnType(result, getTypeDescription(50, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* nftPrices
	*
	* @returns { Result<Result<Array<ReturnTypes.NftPrice>, ReturnTypes.NftTraderError>, ReturnTypes.LangError> }
	*/
	"nftPrices" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<Array<ReturnTypes.NftPrice>, ReturnTypes.NftTraderError>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "nftPrices", [], __options, (result) => { return handleReturnType(result, getTypeDescription(54, DATA_TYPE_DESCRIPTIONS)); });
	}

}