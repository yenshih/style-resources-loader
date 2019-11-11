import {StyleResources, StyleResourcesLoaderNormalizedOptions} from '..';

import {isPromise, errorMessage} from '.';

export const injectResources = async (
    options: StyleResourcesLoaderNormalizedOptions,
    source: string,
    resources: StyleResources,
) => {
    const {injector} = options;

    const dist: any = injector(source, resources);

    const content = isPromise(dist) ? await dist : dist;

    if (typeof content !== 'string') {
        throw new Error(errorMessage.invalidInjectorReturn);
    }

    return content;
};
