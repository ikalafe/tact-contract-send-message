import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/bulk_address.tact',
    options: {
        debug: true,
    },
};
