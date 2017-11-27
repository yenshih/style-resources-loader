import { loader } from 'webpack';

import { StyleResources, StyleResourcesLoaderOptions } from '../';
import { getResources } from './';

export async function loadResources(
    this: loader.LoaderContext,
    source: string | Buffer,
    options: StyleResourcesLoaderOptions,
    callback: loader.loaderCallback,
) {
    try {
        const resources: StyleResources = await getResources.call(this, options);

        const { injector } = options;

        const next: any = injector(source, resources);

        if (typeof next !== 'string' && !(next instanceof Buffer)) {
            throw new TypeError(
                '[style-resources-loader] Expected options.injector(...) returns a string or a Buffer. '
                + `Instead returns ${typeof next}.`,
            );
        }

        return callback(null, next);
    } catch (err) {
        return callback(err);
    }
}
