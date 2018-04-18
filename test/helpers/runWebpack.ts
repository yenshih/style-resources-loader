import webpack, { Configuration } from 'webpack';

export const runWebpack = (config: Configuration) =>
    new Promise((resolve, reject) => webpack(
        config,
        (webpackErr, stats) => {
            const statistics: any = stats;
            const err = webpackErr
                || stats.hasErrors() && statistics.compilation.errors[0]
                || stats.hasWarnings() && statistics.compilation.warnings[0];

            err ? reject(err) : resolve();
        },
    ));
