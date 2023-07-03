[![MIT License][license-shield]][license-url]

## Transaction Inclusion SDK

The SDK package is designed to help the interaction with the [Transaction Inclusion Contracts](https://github.com/LimeChain/tx-inclusion-contracts) in order to gather all the needed data for a transaction and pass it to the contracts for verification.
It is part of the ongoing effort of [LimeLabs](https://limelabs.tech) and [LimeChain](https://limechain.tech) to give back and contribute to the blockchain community in the form of open source tooling and public goods infrastructure.

## Usage Example

```JavaScript
import { TxInclusionSDK } from "@limechain/tx-inclusion-sdk";

const txInclusionSdk = new TxInclusionSDK(rpcUrl);
const txInclusionProof = await txInclusionSdk.getTransactionInclusionProof(txHash);

console.log(txInclusionProof);
```

Where `rpcUrl` should be RPC provider URL, for example Infura.

[license-url]: https://github.com/LimeChain/tx-inclusion-sdk/blob/main/LICENSE.txt
[license-shield]: https://img.shields.io/badge/License-MIT-green.svg
