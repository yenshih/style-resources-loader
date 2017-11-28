import { loader } from 'webpack';

import { getNormalizedOptions, loadResources } from './utils';

import { StyleResourcesLoaderOptions } from './';

const loader: loader.Loader = function (source) {
    this.cacheable && this.cacheable();

    const callback = this.async();

    if (typeof callback !== 'function') {
        throw new Error('[style-resources-loader] Synchronous compilation is not supported.');
    }

    try {
        const options: StyleResourcesLoaderOptions = getNormalizedOptions.call(this);
        loadResources.call(this, source, options, callback);
    } catch (err) {
        callback(err);
    }
};

export default loader;
