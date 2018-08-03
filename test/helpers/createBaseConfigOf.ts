import path from 'path';

import { Configuration } from 'webpack';

import { StyleResourcesFileExt } from '../../src';

const createBaseConfigOf = (ext: StyleResourcesFileExt) =>
    (testId: string, isError: boolean = false): Configuration => ({
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
                    test: new RegExp(`\\.${ext}$`),
                    use: [
                        ...isError ? [] : ['raw-loader'], {
                            loader: path.resolve(__dirname, '../../lib'),
                            /* eslint-disable-next-line global-require, import/no-dynamic-require */
                            options: require(`../options/${testId}`).default(ext),
                        },
                    ],
                },
            ],
        },
    });

export default createBaseConfigOf;
