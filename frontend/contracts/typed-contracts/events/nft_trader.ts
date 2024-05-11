import type * as EventTypes from '../event-types/nft_trader';
import type {ContractPromise} from "@polkadot/api-contract";
import type {ApiPromise} from "@polkadot/api";
import EVENT_DATA_TYPE_DESCRIPTIONS from '../event-data/nft_trader.json';
import {getEventTypeDescription} from "../shared/utils";
import {handleEventReturn} from "@727-ventures/typechain-types";

export default class EventsClass {
	readonly __nativeContract : ContractPromise;
	readonly __api : ApiPromise;

	constructor(
		nativeContract : ContractPromise,
		api : ApiPromise,
	) {
		this.__nativeContract = nativeContract;
		this.__api = api;
	}

	public subscribeOnPortfolioAddedEvent(callback : (event : EventTypes.PortfolioAdded) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('PortfolioAdded', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.PortfolioAdded);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'PortfolioAdded');
	}

	public subscribeOnPortfolioRemovedEvent(callback : (event : EventTypes.PortfolioRemoved) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('PortfolioRemoved', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.PortfolioRemoved);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'PortfolioRemoved');
	}

	public subscribeOnWithdrawnNFTsEvent(callback : (event : EventTypes.WithdrawnNFTs) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('WithdrawnNFTs', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.WithdrawnNFTs);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'WithdrawnNFTs');
	}

	public subscribeOnNFTsForSaleEvent(callback : (event : EventTypes.NFTsForSale) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('NFTsForSale', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.NFTsForSale);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'NFTsForSale');
	}

	public subscribeOnNFTSoldEvent(callback : (event : EventTypes.NFTSold) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('NFTSold', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.NFTSold);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'NFTSold');
	}


	private __subscribeOnEvent(
		callback : (args: any[], event: any) => void,
		filter : (eventName: string) => boolean = () => true
	) {
		// @ts-ignore
		return this.__api.query.system.events((events) => {
			events.forEach((record: any) => {
				const { event } = record;

				if (event.method == 'ContractEmitted') {
					const [address, data] = record.event.data;

					if (address.toString() === this.__nativeContract.address.toString()) {
						const {args, event} = this.__nativeContract.abi.decodeEvent(data);

						if (filter(event.identifier.toString()))
							callback(args, event);
					}
				}
			});
		});
	}

}