import { loadResources, isFunction } from './utils';

import { Loader, LoaderCallback } from '.';

/* eslint-disable-next-line func-style */
const loader: Loader = function (source) {
    this.cacheable && this.cacheable();

    const callback = this.async();

    if (!isFunction<LoaderCallback>(callback)) {
        throw new Error('[style-resources-loader] Synchronous compilation is not supported.');
    }

    Reflect.apply(loadResources, this, [source, callback]);
};

export default loader;
