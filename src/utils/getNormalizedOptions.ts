import { loader } from 'webpack';
import { getOptions } from 'loader-utils';

import { StyleResourcesLoaderOptions, StyleResourcesLoaderOriginalOptions, SpecialInjectors } from '../';
import { isString } from './';

function fixEndLine(content: string): string {
    return /\n+\s*$/g.test(content) ? content : (content + '\n');
}

const SPECIAL_INJECTORS: SpecialInjectors = {
    PREPEND: (source, resources) => [
        ...resources.map(({ content }) => fixEndLine(content)),
        fixEndLine('' + source),
    ].join(''),
    APPEND: (source, resources) => [
        fixEndLine('' + source),
        ...resources.map(({ content }) => fixEndLine(content)),
    ].join(''),
};

export function getNormalizedOptions(this: loader.LoaderContext): StyleResourcesLoaderOptions {
    const defaultGlobOptions = {};

    const defaultResolveUrl = true;

    const options: StyleResourcesLoaderOriginalOptions = getOptions(this) || {};
    if (typeof options.injector === 'undefined') {
        options.injector = SPECIAL_INJECTORS.PREPEND;
    } else if (typeof options.injector === 'string') {
        options.injector = SPECIAL_INJECTORS[options.injector] || options.injector;
    }

    const {
        patterns,
        injector,
        globOptions = defaultGlobOptions,
        resolveUrl = defaultResolveUrl,
    }: StyleResourcesLoaderOriginalOptions = options;

    if (!isString(patterns) && !(Array.isArray(patterns) && patterns.every(isString))) {
        throw new TypeError(
            '[style-resources-loader] Expected options.patterns to be a string or an array of string. '
            + `Instead received ${typeof patterns}.`,
        );
    }

    if (typeof injector !== 'function') {
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
        injector,
        globOptions,
        resolveUrl,
    };
}
