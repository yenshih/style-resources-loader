import { LoaderContext, StyleResources, StyleResourcesLoaderNormalizedOptions } from '..';

import { isString, isPromise } from '.';

/* eslint-disable-next-line max-params */
async function injectResources(
    this: LoaderContext,
    options: StyleResourcesLoaderNormalizedOptions,
    source: string | Buffer,
    resources: StyleResources,
) {
    const { injector } = options;

    const dist: any = injector(source, resources);

    const content = isPromise(dist) ? await dist : dist;

    if (!isString(content) && !(content instanceof Buffer)) {
        throw new TypeError(
            '[style-resources-loader] Expected options.injector(...) returns a string or a Buffer. '
            + `Instead received ${typeof content}.`,
        );
    }

    return content;
}

export default injectResources;
