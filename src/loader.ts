import { loader } from 'webpack';

import { loadResources, isFunction } from './utils';

/* eslint-disable-next-line func-style, no-redeclare */
const loader: loader.Loader = function (source) {
    this.cacheable && this.cacheable();

    const callback = this.async();

    if (!isFunction<loader.loaderCallback>(callback)) {
        throw new Error('[style-resources-loader] Synchronous compilation is not supported.');
    }

    Reflect.apply(loadResources, this, [source, callback]);
};

export default loader;
