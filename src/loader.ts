import { loader } from 'webpack';

import { loadResources } from './utils';

const loader: loader.Loader = function (source) {
    this.cacheable && this.cacheable();

    const callback = this.async();

    if (typeof callback !== 'function') {
        throw new Error('[style-resources-loader] Synchronous compilation is not supported.');
    }

    loadResources.call(this, source, callback);
};

export default loader;
