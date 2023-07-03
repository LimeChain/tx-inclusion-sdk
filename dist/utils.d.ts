/// <reference types="node" />
export declare function getTransactionByHash(rpcUrl: string, hash: string): Promise<any>;
export declare function getTransactionReceipt(rpcUrl: string, hash: string): Promise<any>;
export declare function getBlockByHash(rpcUrl: string, hash: string): Promise<any>;
export declare function padZeros(val: string): string;
export declare function index2key(index: number, proofLength: number): string;
export declare function buffer2hex(buffer: Buffer): string;
