import {LoaderContext, LoaderCallback} from '..';

import {normalizeOptions, getResources, injectResources} from '.';

/* eslint max-statements: [2, 20] */
export const loadResources = async (ctx: LoaderContext, source: string, callback: LoaderCallback) => {
    try {
        const options = normalizeOptions(ctx);
        const {test = '', filename = ctx.resourcePath} = options;

        if (test && filename) {
            /* eslint-disable-next-line @typescript-eslint/prefer-regexp-exec */
            if ((test instanceof RegExp || typeof test === 'string') && !filename.match(test)) {
                return callback(null, source);
            }
            if (typeof test === 'function' && !test(filename)) {
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
