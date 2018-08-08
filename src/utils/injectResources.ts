import { loader } from 'webpack';

import { StyleResourcesLoaderNormalizedOptions, StyleResources } from '..';

/* eslint-disable-next-line max-params */
async function injectResources(
    this: loader.LoaderContext,
    options: StyleResourcesLoaderNormalizedOptions,
    source: string | Buffer,
    resources: StyleResources,
) {
    const { injector } = options;

    const dist: any = injector(source, resources);

    const content = dist && typeof dist.then === 'function' ? await dist : dist;

    if (typeof content !== 'string' && !(content instanceof Buffer)) {
        throw new TypeError(
            '[style-resources-loader] Expected options.injector(...) returns a string or a Buffer. '
            + `Instead received ${typeof content}.`,
        );
    }

    return content;
}

export default injectResources;
