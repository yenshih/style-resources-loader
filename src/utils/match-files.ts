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

    return [...new Set(flatten(files))];
};
