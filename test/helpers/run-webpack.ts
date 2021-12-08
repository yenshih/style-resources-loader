import webpack from 'webpack';
import type {Configuration} from 'webpack';

export const runWebpack = (config: Configuration) =>
    new Promise<void>((resolve, reject) => {
        webpack(config, (webpackErr, stats) => {
            const err = webpackErr || (stats.hasErrors() && stats.compilation.errors[0]);

            err ? reject(err) : resolve();
        });
    });
