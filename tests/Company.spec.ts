import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Company } from '../wrappers/Company';
import '@ton/test-utils';
import { Fund } from '../wrappers/Fund';

describe('Company & Fund', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let company: SandboxContract<Company>;
    let fund: SandboxContract<Fund>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        company = blockchain.openContract(await Company.fromInit());
        fund = blockchain.openContract(await Fund.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResultCompany = await company.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        const deployResultFuns = await fund.send(
            deployer.getSender(),
            {
                value: toNano("0.05"),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResultCompany.transactions).toHaveTransaction({
            from: deployer.address,
            to: company.address,
            deploy: true,
            success: true,
        });

        expect(deployResultFuns.transactions).toHaveTransaction({
            from: deployer.address,
            to: fund.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and company are ready to use
    });

    it('should withdraw', async () => {
         await fund.send(
            deployer.getSender(),
            {
                value: toNano("0.2"),
            },
            {
                $$type: 'Withdraw',
                amount: 3n,
                target: company.address,
            },
        );

        const balanceFund = await fund.getBalance();
        const balanceCompany = await company.getBalance();

        console.log("BalanceFund -", balanceFund);
        console.log("BalanceCompany -", balanceCompany);
        
        
        expect(balanceFund).toEqual(7n);
        expect(balanceCompany).toEqual(3n);
    });
});
