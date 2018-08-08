import {
    StyleResourcesFunctionalInjector,
    StyleResourcesLoaderOptions,
} from '..';

import { isUndefined, isString, isBoolean, isObject, isFunction } from '.';

const internalInjectorKeys = ['prepend', 'append'];

const validatePatterns = (patterns: any): patterns is StyleResourcesLoaderOptions['patterns'] =>
    isString(patterns) || Array.isArray(patterns) && patterns.every(isString);

const validateInjector = (injector: any): injector is StyleResourcesLoaderOptions['injector'] =>
    isUndefined(injector)
    || isFunction<StyleResourcesFunctionalInjector>(injector)
    || internalInjectorKeys.includes(injector);

const validateGlobOptions = (globOptions: any): globOptions is StyleResourcesLoaderOptions['globOptions'] =>
    isUndefined(globOptions) || isObject<NonNullable<StyleResourcesLoaderOptions['globOptions']>>(globOptions);

const validateResolveUrl = (resolveUrl: any): resolveUrl is StyleResourcesLoaderOptions['resolveUrl'] =>
    isUndefined(resolveUrl) || isBoolean(resolveUrl);

const valiateOptions = (options: any): options is StyleResourcesLoaderOptions => {
    const { patterns, injector, globOptions, resolveUrl } = options;

    if (!validatePatterns(patterns)) {
        throw new TypeError(
            '[style-resources-loader] Expected options.patterns to be a string or an array of string. '
            + `Instead received ${typeof patterns}.`,
        );
    }

    if (!validateInjector(injector)) {
        throw new TypeError(
            '[style-resources-loader] Expected options.injector to be a function or `prepend`, `append`. '
            + `Instead received ${typeof injector}.`,
        );
    }

    if (!validateGlobOptions(globOptions)) {
        throw new TypeError(
            '[style-resources-loader] Expected options.globOptions to be an object. '
            + `Instead received ${typeof globOptions}.`,
        );
    }

    if (!validateResolveUrl(resolveUrl)) {
        throw new TypeError(
            '[style-resources-loader] Expected options.resolveUrl to be a boolean. '
            + `Instead received ${typeof resolveUrl}.`,
        );
    }

    return true;
};

export default valiateOptions;
