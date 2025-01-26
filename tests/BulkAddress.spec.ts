import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { BulkAddress } from '../wrappers/BulkAddress';
import '@ton/test-utils';
import { Counter } from '../wrappers/Counter';

describe('BulkAddress and Counter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let bulkAddress: SandboxContract<BulkAddress>;
    let counter: SandboxContract<Counter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        bulkAddress = blockchain.openContract(await BulkAddress.fromInit());
        counter = blockchain.openContract(await Counter.fromInit(1n));

        deployer = await blockchain.treasury('deployer');

        const deployResultBulkAddress = await bulkAddress.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        const deployResultCounter = await counter.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResultBulkAddress.transactions).toHaveTransaction({
            from: deployer.address,
            to: bulkAddress.address,
            deploy: true,
            success: true,
        });

        expect(deployResultCounter.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and bulkAddress are ready to use
    });

    it('should increse to target', async () => {
        const target = 10n;
        const res = await bulkAddress.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'Reach',
                counter: counter.address,
                target: target,
            },
        );
        // console.log(res);

        const count = await counter.getCounter();
        expect(count).toEqual(target);
    });
});
