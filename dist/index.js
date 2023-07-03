import { getTransactionByHash, getTransactionReceipt, getBlockByHash, padZeros, index2key, } from './utils.js';
import { RLP } from '@ethereumjs/rlp';
import { Trie } from '@ethereumjs/trie';
import { encodeReceipt } from "@ethereumjs/vm/dist/runBlock.js";
import { BigNumber, ethers } from 'ethers';
export class TxInclusionSDK {
    rpcUrl;
    constructor(rpcUrl) {
        this.rpcUrl = rpcUrl;
    }
    async getTransactionInclusionProof(txHash) {
        // gather data
        const txData = await getTransactionByHash(this.rpcUrl, txHash);
        const txReceipt = await getTransactionReceipt(this.rpcUrl, txHash);
        // check tx status == 0
        if (parseInt(txReceipt.status) !== 1)
            throw new Error("tx status is not successfull");
        const blockData = await getBlockByHash(this.rpcUrl, txData.blockHash);
        const txReceipts = await Promise.all(blockData.transactions.map((txHash) => {
            return getTransactionReceipt(this.rpcUrl, txHash);
        }));
        const sortedTxReceipts = txReceipts.sort((a, b) => {
            return parseInt(a.transactionIndex) - parseInt(b.transactionIndex);
        });
        const receiptTrie = new Trie();
        for (let i = 0; i < sortedTxReceipts.length; i++) {
            try {
                const logs = sortedTxReceipts[i].logs.map((log) => {
                    return [
                        Buffer.from(log.address.slice(2), 'hex'),
                        log.topics.map((topic) => Buffer.from(topic.slice(2), 'hex')),
                        Buffer.from(log.data.slice(2), 'hex')
                    ];
                });
                const receipt = {
                    status: sortedTxReceipts[i].status === '0x1' ? 1 : 0,
                    cumulativeBlockGasUsed: BigInt(sortedTxReceipts[i].cumulativeGasUsed),
                    bitvector: Buffer.from(sortedTxReceipts[i].logsBloom.slice(2), 'hex'),
                    logs: logs,
                };
                const encodedReceipt = encodeReceipt(receipt, parseInt(sortedTxReceipts[i].type));
                //@ts-ignore
                await receiptTrie.put(RLP.encode(parseInt(sortedTxReceipts[i].transactionIndex)), encodedReceipt);
            }
            catch (error) {
                console.error(`Failed to add data to trie at index ${i}: ${error}`);
            }
        }
        // check if receipts root matches
        if (blockData.receiptsRoot !== `0x${receiptTrie.root().toString('hex')}`) {
            throw new Error("Receipts root mismatch");
        }
        const proof = await receiptTrie.createProof(Buffer.from(RLP.encode(parseInt(txReceipt.transactionIndex))));
        try {
            await receiptTrie.verifyProof(receiptTrie.root(), Buffer.from(RLP.encode(parseInt(txReceipt.transactionIndex))), proof);
        }
        catch (error) {
            throw Error("Invalid proof");
        }
        const blockDataDto = {
            parentHash: ethers.utils.arrayify(blockData.parentHash),
            sha3Uncles: ethers.utils.arrayify(blockData.sha3Uncles),
            miner: blockData.miner,
            stateRoot: ethers.utils.arrayify(blockData.stateRoot),
            transactionsRoot: ethers.utils.arrayify(blockData.transactionsRoot),
            receiptsRoot: ethers.utils.arrayify(blockData.receiptsRoot),
            logsBloom: ethers.utils.arrayify(blockData.logsBloom),
            difficulty: BigNumber.from(blockData.difficulty),
            number: BigNumber.from(blockData.number),
            gasLimit: BigNumber.from(blockData.gasLimit),
            gasUsed: BigNumber.from(blockData.gasUsed),
            timestamp: BigNumber.from(blockData.timestamp),
            extraData: ethers.utils.arrayify(blockData.extraData),
            mixHash: ethers.utils.arrayify(blockData.mixHash),
            nonce: ethers.utils.arrayify(blockData.nonce),
            baseFeePerGas: BigNumber.from(blockData.baseFeePerGas),
            withdrawalsRoot: ethers.utils.arrayify(blockData.withdrawalsRoot)
        };
        const logs = txReceipt.logs.map((log) => {
            return {
                addr: log.address,
                topics: log.topics.map((topic) => ethers.utils.arrayify(topic)),
                data: ethers.utils.arrayify(log.data),
            };
        });
        const keyNum = BigNumber.from(txReceipt.transactionIndex).toNumber();
        const key = index2key(keyNum, proof.length);
        const receiptDto = {
            receiptType: BigNumber.from(padZeros(txReceipt.type)),
            postStateOrStatus: BigNumber.from(txReceipt.status),
            cumulativeGasUsed: BigNumber.from(txReceipt.cumulativeGasUsed),
            keyIndex: key,
            bloom: ethers.utils.arrayify(txReceipt.logsBloom),
            logs: logs
        };
        const proverDto = {
            blockData: blockDataDto,
            txReceipt: receiptDto,
            blockNumber: BigNumber.from(blockData.number),
            receiptProofBranch: proof
        };
        return proverDto;
    }
}
//# sourceMappingURL=index.js.map