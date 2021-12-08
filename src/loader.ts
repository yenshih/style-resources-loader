import {errorMessage, isFunction, loadResources} from './utils';

import type {Loader, LoaderCallback} from '.';

const loader: Loader = function (source) {
    this.cacheable();

    const callback = this.async();

    if (!isFunction<LoaderCallback>(callback)) {
        throw new Error(errorMessage.syncCompilation);
    }

    /* istanbul ignore if: not possible to test */
    if (typeof source !== 'string') {
        throw new Error(errorMessage.impossible);
    }

    void loadResources(this, source, callback);
};

export default loader;
