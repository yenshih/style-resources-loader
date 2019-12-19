import path from 'path';
import util from 'util';

import glob from 'glob';

import {LoaderContext, StyleResourcesLoaderNormalizedOptions} from '..';

import {isStyleFile} from '.';

const isLegacyWebpack = (ctx: any): ctx is {options: {context: string}} => !!ctx.options;

const getRootContext = (ctx: LoaderContext) => {
    /* istanbul ignore if: will be deprecated soon */
    if (isLegacyWebpack(ctx)) {
        return ctx.options.context;
    }

    return ctx.rootContext;
};

const flatten = <T>(items: T[][]) => {
    const emptyItems: T[] = [];

    return emptyItems.concat(...items);
};

export const matchFiles = async (ctx: LoaderContext, options: StyleResourcesLoaderNormalizedOptions) => {
    const {patterns, globOptions} = options;

    const files = await Promise.all(
        patterns.map(async pattern => {
            const rootContext = getRootContext(ctx);
            const absolutePattern = path.isAbsolute(pattern) ? pattern : path.resolve(rootContext, pattern);
            const partialFiles = await util.promisify(glob)(absolutePattern, globOptions);

            return partialFiles.filter(isStyleFile);
        }),
    );
    /*
     * Glob always return unix style file path which would have problems on Windows.
     * For more details, see: https://github.com/yenshih/style-resources-loader/issues/17
     *
     * Use path.resolve() method to convert the unix style file path to system compatible
     * file path.
     */
    const systemCompatibleFiles = flatten(files).map(file => path.resolve(file));

    return [...new Set(systemCompatibleFiles)];
};
