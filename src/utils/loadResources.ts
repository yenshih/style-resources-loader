import {LoaderContext, LoaderCallback, StyleResources, StyleResourcesLoaderNormalizedOptions} from '..';

import {normalizeOptions, getResources, injectResources} from '.';

const loadResources = async function(ctx: LoaderContext, source: string, callback: LoaderCallback) {
    try {
        const options: StyleResourcesLoaderNormalizedOptions = normalizeOptions(ctx);

        const resources: StyleResources = await getResources(ctx, options);

        const content: string | Buffer = await injectResources(options, source, resources);

        return callback(null, content);
    } catch (err) {
        return callback(err);
    }
};

export default loadResources;
