import {LoaderContext, LoaderCallback} from '..';

import {normalizeOptions, getResources, injectResources} from '.';

export const loadResources = async (ctx: LoaderContext, source: string, callback: LoaderCallback) => {
    try {
        const options = normalizeOptions(ctx);

        const resources = await getResources(ctx, options);

        const content = await injectResources(options, source, resources);

        return callback(null, content);
    } catch (err) {
        return callback(err);
    }
};
