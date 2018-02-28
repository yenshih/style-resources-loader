import { loader } from 'webpack';
import { getOptions } from 'loader-utils';

import {
    StyleResourcesLoaderOptions,
    StyleResourcesLoaderOriginalOptions,
    StyleResourcesSpecialInjectors,
    StyleResourcesInjector,
} from '../';
import { isString } from './';

const specialInjectors: StyleResourcesSpecialInjectors = {
    prepend: (source, resources) => [
        ...resources.map(({ content }) => content),
        source,
    ].join(''),
    append: (source, resources) => [
        source,
        ...resources.map(({ content }) => content),
    ].join(''),
};

function getNormalizedInjector(
    inputInjector: StyleResourcesInjector | keyof StyleResourcesSpecialInjectors,
): StyleResourcesInjector {
    return typeof inputInjector === 'function' ? inputInjector : specialInjectors[inputInjector];
}

export function getNormalizedOptions(this: loader.LoaderContext): StyleResourcesLoaderOptions {
    const defaultInjector = 'prepend';

    const defaultGlobOptions = {};

    const defaultResolveUrl = true;

    const {
        patterns,
        injector = defaultInjector,
        globOptions = defaultGlobOptions,
        resolveUrl = defaultResolveUrl,
    }: StyleResourcesLoaderOriginalOptions = getOptions(this) || {};

    if (!isString(patterns) && !(Array.isArray(patterns) && patterns.every(isString))) {
        throw new TypeError(
            '[style-resources-loader] Expected options.patterns to be a string or an array of string. '
            + `Instead received ${typeof patterns}.`,
        );
    }

    if (typeof injector !== 'function' && !Object.keys(specialInjectors).includes(injector)) {
        throw new TypeError(
            '[style-resources-loader] Expected options.injector to be a function '
            + 'or one of the two constants: `PREPEND` and `APPEND`. '
            + `Instead received ${typeof injector}.`,
        );
    }

    if (typeof globOptions !== 'object') {
        throw new TypeError(
            '[style-resources-loader] Expected options.globOptions to be an object. '
            + `Instead received ${typeof globOptions}.`,
        );
    }

    if (typeof resolveUrl !== 'boolean') {
        throw new TypeError(
            '[style-resources-loader] Expected options.resolveUrl to be a boolean. '
            + `Instead received ${typeof resolveUrl}.`,
        );
    }

    return {
        patterns,
        injector: getNormalizedInjector(injector),
        globOptions,
        resolveUrl,
    };
}
