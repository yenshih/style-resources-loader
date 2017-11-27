import * as path from 'path';

import webpack, { Configuration } from 'webpack';
import merge from 'webpack-merge';

import { StyleResourcesFileExt } from '../../src';

export const runWebpackOf = (ext: StyleResourcesFileExt) =>
    (testId: string, baseConfig: Configuration) =>
    new Promise((resolve, reject) => webpack(
        merge(baseConfig, {
            output: {
                path: path.resolve(__dirname, `../${ext}/outputs`),
                filename: `${testId}.js`,
                libraryTarget: 'commonjs2',
            },
        }),
        (webpackErr, stats) => {
            const err = webpackErr
                || stats.hasErrors() && (stats as any).compilation.errors[0]
                || stats.hasWarnings() && (stats as any).compilation.warnings[0];
            err ? reject(err) : resolve();
        },
    ));
