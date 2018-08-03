import { loader } from 'webpack';

import { StyleResources, StyleResourcesLoaderOptions } from '..';

import { getNormalizedOptions, getResources, injectResources } from '.';

async function loadResources(
    this: loader.LoaderContext,
    source: string | Buffer,
    callback: loader.loaderCallback,
) {
    try {
        const options: StyleResourcesLoaderOptions = Reflect.apply(getNormalizedOptions, this, []);

        const resources: StyleResources = await Reflect.apply(getResources, this, [options]);

        const content: string | Buffer = await Reflect.apply(injectResources, this, [options, source, resources]);

        return callback(null, content);
    }
    catch (err) {
        return callback(err);
    }
}

export default loadResources;
