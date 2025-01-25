import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Messages } from '../wrappers/Messages';
import '@ton/test-utils';

describe('Messages', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let messages: SandboxContract<Messages>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        messages = blockchain.openContract(await Messages.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await messages.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: messages.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and messages are ready to use
    });
});
