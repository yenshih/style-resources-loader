import {StyleResources, StyleResourcesLoaderNormalizedOptions} from '..';

import {isString, isPromise} from '.';
import {throwValidationError} from './errors';

/* eslint-disable-next-line max-params */
const injectResources = async (
    options: StyleResourcesLoaderNormalizedOptions,
    source: string,
    resources: StyleResources,
) => {
    const {injector} = options;

    const dist: any = injector(source, resources);

    const content = isPromise(dist) ? await dist : dist;

    if (!isString(content)) {
        return throwValidationError('options.injector(...) returns a string', typeof content);
    }

    return content;
};

export default injectResources;
