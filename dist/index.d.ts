import { ProverDtoStruct } from './types';
export declare class TxInclusionSDK {
    readonly rpcUrl: string;
    constructor(rpcUrl: string);
    getTransactionInclusionProof(txHash: string): Promise<ProverDtoStruct>;
}
