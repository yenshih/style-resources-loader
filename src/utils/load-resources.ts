import {LoaderContext, LoaderCallback} from '..';

import {normalizeOptions, getResources, injectResources} from '.';

/* eslint max-statements: [2, 20] */
export const loadResources = async (ctx: LoaderContext, source: string, callback: LoaderCallback) => {
    try {
        const options = normalizeOptions(ctx);

        if (options.test && ctx.resourcePath) {
            const {test} = options;

            /* eslint-disable-next-line @typescript-eslint/prefer-regexp-exec */
            if ((test instanceof RegExp || typeof test === 'string') && !ctx.resourcePath.match(test)) {
                return callback(null, source);
            }
            if (typeof test === 'function' && !test(ctx.resourcePath)) {
                return callback(null, source);
            }
        }

        const resources = await getResources(ctx, options);

        const content = await injectResources(options, source, resources);

        return callback(null, content);
    } catch (err) {
        return callback(err);
    }
};
