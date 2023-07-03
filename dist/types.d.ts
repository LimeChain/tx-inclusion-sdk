import type { BigNumberish, BytesLike } from "ethers";
export type BlockDataStruct = {
    parentHash: BytesLike;
    sha3Uncles: BytesLike;
    miner: string;
    stateRoot: BytesLike;
    transactionsRoot: BytesLike;
    receiptsRoot: BytesLike;
    logsBloom: BytesLike;
    difficulty: BigNumberish;
    number: BigNumberish;
    gasLimit: BigNumberish;
    gasUsed: BigNumberish;
    timestamp: BigNumberish;
    extraData: BytesLike;
    mixHash: BytesLike;
    nonce: BytesLike;
    baseFeePerGas: BigNumberish;
    withdrawalsRoot: BytesLike;
};
export type TxLogStruct = {
    addr: string;
    topics: BytesLike[];
    data: BytesLike;
};
export type ProverDtoStruct = {
    blockData: BlockDataStruct;
    txReceipt: TxReceiptStruct;
    blockNumber: BigNumberish;
    receiptProofBranch: BytesLike[];
};
export type TxReceiptStruct = {
    receiptType: BigNumberish;
    postStateOrStatus: BigNumberish;
    cumulativeGasUsed: BigNumberish;
    keyIndex: BytesLike;
    bloom: BytesLike;
    logs: TxLogStruct[];
};
