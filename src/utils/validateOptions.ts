import {StyleResourcesFunctionalInjector, StyleResourcesLoaderOptions} from '..';

import {isUndefined, isString, isBoolean, isObject, isFunction, throwValidationError} from '.';

const internalInjectorKeys = ['prepend', 'append'];

const validatePatterns = (patterns: any): patterns is StyleResourcesLoaderOptions['patterns'] =>
    isString(patterns) || (Array.isArray(patterns) && patterns.every(isString));

const validateInjector = (injector: any): injector is StyleResourcesLoaderOptions['injector'] =>
    isUndefined(injector) ||
    isFunction<StyleResourcesFunctionalInjector>(injector) ||
    internalInjectorKeys.includes(injector);

const validateGlobOptions = (globOptions: any): globOptions is StyleResourcesLoaderOptions['globOptions'] =>
    isUndefined(globOptions) || isObject<NonNullable<StyleResourcesLoaderOptions['globOptions']>>(globOptions);

const validateResolveUrl = (resolveUrl: any): resolveUrl is StyleResourcesLoaderOptions['resolveUrl'] =>
    isUndefined(resolveUrl) || isBoolean(resolveUrl);

const valiateOptions = (options: any): options is StyleResourcesLoaderOptions => {
    const {patterns, injector, globOptions, resolveUrl} = options;

    if (!validatePatterns(patterns)) {
        throwValidationError('options.patterns to be a string or an array of string', typeof patterns);
    }

    if (!validateInjector(injector)) {
        throwValidationError('options.injector to be a function or `prepend`, `append`', typeof injector);
    }

    if (!validateGlobOptions(globOptions)) {
        throwValidationError('options.globOptions to be an object', typeof globOptions);
    }

    if (!validateResolveUrl(resolveUrl)) {
        throwValidationError('options.resolveUrl to be a boolean', typeof resolveUrl);
    }

    return true;
};

export default valiateOptions;
