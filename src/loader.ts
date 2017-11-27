import { loader } from 'webpack';

import { getNormalizedOptions, loadResources } from './utils';

// TODO: supports stylus
export type StyleResourcesFileExt = 'sass' | 'scss' | 'less';

export interface StyleResource {
    file: string;
    content: string;
}

export type StyleResources = ReadonlyArray<StyleResource>;

export type StyleResourcesInjector = (source: string | Buffer, resources: StyleResources) => string;

export interface StyleResourcesLoaderOptions {
    patterns: string | string[];
    injector: StyleResourcesInjector;
    resolveUrl: boolean;
}

export type StyleResourcesLoaderOriginalOptions = Partial<StyleResourcesLoaderOptions>;

const loader: loader.Loader = function (source) {
    this.cacheable && this.cacheable();

    const callback = this.async();

    if (typeof callback !== 'function') {
        return this.callback(new Error('[style-resources-loader] Synchronous compilation is not supported.'));
    }

    const options: StyleResourcesLoaderOptions | undefined = getNormalizedOptions.call(this, callback);

    options && loadResources.call(this, source, options, callback);
};

export default loader;
