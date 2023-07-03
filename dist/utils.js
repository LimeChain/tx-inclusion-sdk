import axios from 'axios';
import { encode } from 'eth-util-lite';
function getParams(method, params) {
    return { "jsonrpc": "2.0", "method": method, "params": params, "id": 1 };
}
export async function getTransactionByHash(rpcUrl, hash) {
    return await axios.post(rpcUrl, getParams('eth_getTransactionByHash', [hash]))
        .then((response) => {
        return response.data.result;
    })
        .catch((error) => {
        return error;
    });
}
export async function getTransactionReceipt(rpcUrl, hash) {
    return await axios.post(rpcUrl, getParams('eth_getTransactionReceipt', [hash]))
        .then((response) => {
        return response.data.result;
    })
        .catch((error) => {
        return error;
    });
}
export async function getBlockByHash(rpcUrl, hash) {
    return await axios.post(rpcUrl, getParams('eth_getBlockByHash', [hash, false]))
        .then((response) => {
        return response.data.result;
    })
        .catch((error) => {
        return error;
    });
}
export function padZeros(val) {
    let nonZero = val.slice(2);
    if (nonZero.length % 2 !== 0) {
        nonZero = `0${nonZero}`;
    }
    return `0x${nonZero}`;
}
export function index2key(index, proofLength) {
    const actualkey = new Array;
    const encoded = buffer2hex(encode(index)).slice(2);
    let key = [...new Array(encoded.length / 2).keys()].map(i => parseInt(encoded[i * 2] + encoded[i * 2 + 1], 16));
    key.forEach(val => {
        if (actualkey.length + 1 === proofLength) {
            actualkey.push(val);
        }
        else {
            actualkey.push(Math.floor(val / 16));
            actualkey.push(val % 16);
        }
    });
    return '0x' + actualkey.map(v => v.toString(16).padStart(2, '0')).join('');
}
export function buffer2hex(buffer) {
    return '0x' + buffer.toString('hex');
}
//# sourceMappingURL=utils.js.map