import webpack, { Configuration } from 'webpack';

export const runWebpack = (config: Configuration) =>
    new Promise((resolve, reject) => webpack(
        config,
        (webpackErr, stats) => {
            const err = webpackErr
                || stats.hasErrors() && (stats as any).compilation.errors[0]
                || stats.hasWarnings() && (stats as any).compilation.warnings[0];
            err ? reject(err) : resolve();
        },
    ));
