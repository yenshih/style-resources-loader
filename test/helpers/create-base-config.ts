import path from 'path';

import type {Configuration} from 'webpack';

import type {StyleResourcesFileFormat} from '../../src';

interface OptionsFactoryModule {
    default: (format: StyleResourcesFileFormat) => any;
}

export const createBaseConfigOf =
    (format: StyleResourcesFileFormat) =>
    async (testId: string, isError = false): Promise<Configuration> => ({
        context: path.resolve(__dirname, '..'),
        entry: `./${format}/source.${format}`,
        output: {
            path: path.resolve(__dirname, `../${format}/outputs`),
            filename: `${testId}.js`,
            libraryTarget: 'commonjs2',
        },
        mode: 'production',
        module: {
            rules: [
                {
                    test: new RegExp(`\\.${format}$`, 'u'),
                    use: [
                        ...(isError ? [] : ['raw-loader']),
                        {
                            loader: '../src/index.ts',
                            options: ((await import(`../options/${testId}`)) as OptionsFactoryModule).default(format),
                        },
                    ],
                },
            ],
        },
    });
