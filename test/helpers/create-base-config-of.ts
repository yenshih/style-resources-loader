import path from 'path';

import {Configuration} from 'webpack';

import {StyleResourcesFileFormat} from '../../src';

const createBaseConfigOf = (format: StyleResourcesFileFormat) => async (
    testId: string,
    isError = false,
): Promise<Configuration> => ({
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
                        options: (await import(`../options/${testId}`)).default(format),
                    },
                ],
            },
        ],
    },
});

export default createBaseConfigOf;
