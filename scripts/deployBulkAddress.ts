import { toNano } from '@ton/core';
import { BulkAddress } from '../wrappers/BulkAddress';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const bulkAddress = provider.open(await BulkAddress.fromInit());

    await bulkAddress.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(bulkAddress.address);

    // run methods on `bulkAddress`
}
