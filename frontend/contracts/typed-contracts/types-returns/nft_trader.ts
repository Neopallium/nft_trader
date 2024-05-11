import type BN from 'bn.js';
import type {ReturnNumber} from '@727-ventures/typechain-types';

export type AccountId = string | number[]

export type BTreeSet = Array<NftId>;

export type NftId = number;

export type Ticker = Array<number>;

export interface NftTraderError {
	polymeshInk ? : PolymeshError,
	notInitialized ? : null,
	alreadyInitialized ? : null,
	contractClosed ? : null,
	invalidPortfolioAuthorization ? : null,
	alreadyHavePortfolio ? : null,
	noPortfolio ? : null,
	missingPortfolio ? : null,
	notInPortfolio ? : null,
	notForSale ? : null,
	transferredValueTooLow ? : null,
	failedToPaySeller ? : null,
	notAdmin ? : null
}

export class NftTraderErrorBuilder {
	static PolymeshInk(value: PolymeshError): NftTraderError {
		return {
			polymeshInk: value,
		};
	}
	static NotInitialized(): NftTraderError {
		return {
			notInitialized: null,
		};
	}
	static AlreadyInitialized(): NftTraderError {
		return {
			alreadyInitialized: null,
		};
	}
	static ContractClosed(): NftTraderError {
		return {
			contractClosed: null,
		};
	}
	static InvalidPortfolioAuthorization(): NftTraderError {
		return {
			invalidPortfolioAuthorization: null,
		};
	}
	static AlreadyHavePortfolio(): NftTraderError {
		return {
			alreadyHavePortfolio: null,
		};
	}
	static NoPortfolio(): NftTraderError {
		return {
			noPortfolio: null,
		};
	}
	static MissingPortfolio(): NftTraderError {
		return {
			missingPortfolio: null,
		};
	}
	static NotInPortfolio(): NftTraderError {
		return {
			notInPortfolio: null,
		};
	}
	static NotForSale(): NftTraderError {
		return {
			notForSale: null,
		};
	}
	static TransferredValueTooLow(): NftTraderError {
		return {
			transferredValueTooLow: null,
		};
	}
	static FailedToPaySeller(): NftTraderError {
		return {
			failedToPaySeller: null,
		};
	}
	static NotAdmin(): NftTraderError {
		return {
			notAdmin: null,
		};
	}
}

export interface PolymeshError {
	polymeshRuntime ? : Error,
	missingIdentity ? : null,
	invalidPortfolioAuthorization ? : null,
	inkDelegateCallError ? : Array<number>
}

export class PolymeshErrorBuilder {
	static PolymeshRuntime(value: Error): PolymeshError {
		return {
			polymeshRuntime: value,
		};
	}
	static MissingIdentity(): PolymeshError {
		return {
			missingIdentity: null,
		};
	}
	static InvalidPortfolioAuthorization(): PolymeshError {
		return {
			invalidPortfolioAuthorization: null,
		};
	}
	static InkDelegateCallError(value: Array<number>): PolymeshError {
		return {
			inkDelegateCallError: value,
		};
	}
}

export interface Error {
	parityScaleCodec ? : string,
	generic ? : number,
	extrinsicCallFailed ? : string
}

export class ErrorBuilder {
	static ParityScaleCodec(value: string): Error {
		return {
			parityScaleCodec: value,
		};
	}
	static Generic(value: number): Error {
		return {
			generic: value,
		};
	}
	static ExtrinsicCallFailed(value: string): Error {
		return {
			extrinsicCallFailed: value,
		};
	}
}

export enum InkEnvError {
	scaleDecodeError = 'ScaleDecodeError',
	calleeTrapped = 'CalleeTrapped',
	calleeReverted = 'CalleeReverted',
	keyNotFound = 'KeyNotFound',
	transferFailed = 'TransferFailed',
	endowmentTooLow = '_EndowmentTooLow',
	codeNotFound = 'CodeNotFound',
	notCallable = 'NotCallable',
	loggingDisabled = 'LoggingDisabled',
	ecdsaRecoveryFailed = 'EcdsaRecoveryFailed'
}

export enum LangError {
	couldNotReadInput = 'CouldNotReadInput'
}

export type PortfolioName = Array<number>;

export type PortfolioNumber = number;

export interface PortfolioKind {
	default ? : null,
	user ? : PortfolioNumber
}

export class PortfolioKindBuilder {
	static Default(): PortfolioKind {
		return {
			default: null,
		};
	}
	static User(value: PortfolioNumber): PortfolioKind {
		return {
			user: value,
		};
	}
}

export type BTreeMap = Array<[NftId, ReturnNumber | null]>;

export type VenueId = number;

export type IdentityId = string | number[]

export type PortfolioId = {
	did: IdentityId,
	kind: PortfolioKind
}

export type NftSaleDetails = {
	account: AccountId,
	did: IdentityId,
	price: ReturnNumber
}

export type NftPrice = {
	id: NftId,
	price: ReturnNumber
}

