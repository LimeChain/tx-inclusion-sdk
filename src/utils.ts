import axios from 'axios';
import { encode } from 'eth-util-lite';

function getParams(method: string, params: any[]): any {
    return { "jsonrpc": "2.0", "method": method, "params": params, "id": 1 }
}

export async function getTransactionByHash(rpcUrl: string, hash: string): Promise<any> {
    return await axios.post(rpcUrl, getParams('eth_getTransactionByHash', [hash]))
        .then((response) => {
            return response.data.result;
        })
        .catch((error) => {
            return error;
        })
}

export async function getTransactionReceipt(rpcUrl: string, hash: string): Promise<any> {
    return await axios.post(rpcUrl, getParams('eth_getTransactionReceipt', [hash]))
        .then((response) => {
            return response.data.result;
        })
        .catch((error) => {
            return error;
        })
}

export async function getBlockByHash(rpcUrl: string, hash: string): Promise<any> {
    return await axios.post(rpcUrl, getParams('eth_getBlockByHash', [hash, false]))
        .then((response) => {
            return response.data.result;
        })
        .catch((error) => {
            return error;
        })
}

export function padZeros(val: string): string {
    let nonZero = val.slice(2);
    if (nonZero.length % 2 !== 0) {
        nonZero = `0${nonZero}`;
    }
    return `0x${nonZero}`;
}

export function index2key(index: number, proofLength: number) {
    const actualkey: Array<number> = new Array<number>;
    const encoded = buffer2hex(encode(index)).slice(2);
    let key = [...new Array(encoded.length / 2).keys()].map(i => parseInt(encoded[i * 2] + encoded[i * 2 + 1], 16));

    key.forEach(val => {
        if (actualkey.length + 1 === proofLength) {
            actualkey.push(val);
        } else {
            actualkey.push(Math.floor(val / 16));
            actualkey.push(val % 16);
        }
    });
    return '0x' + actualkey.map(v => v.toString(16).padStart(2, '0')).join('');
}

export function buffer2hex(buffer: Buffer) {
    return '0x' + buffer.toString('hex');
}