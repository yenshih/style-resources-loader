import path from 'path';

import {Configuration} from 'webpack';

import {StyleResourcesFileExt} from '../../src';

const createBaseConfigOf = (ext: StyleResourcesFileExt) => async (
    testId: string,
    isError: boolean = false,
): Promise<Configuration> => ({
    entry: path.resolve(__dirname, `../${ext}/source.${ext}`),
    output: {
        path: path.resolve(__dirname, `../${ext}/outputs`),
        filename: `${testId}.js`,
        libraryTarget: 'commonjs2',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: new RegExp(`\\.${ext}$`, 'u'),
                use: [
                    ...(isError ? [] : ['raw-loader']),
                    {
                        loader: path.resolve(__dirname, '../../src/index.ts'),
                        options: (await import(`../options/${testId}`)).default(ext),
                    },
                ],
            },
        ],
    },
});

export default createBaseConfigOf;
