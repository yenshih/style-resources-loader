import { getOptions } from 'loader-utils';

import {
    LoaderContext,
    StyleResourcesNormalizedInjector,
    StyleResourcesLoaderOptions,
    StyleResourcesLoaderNormalizedOptions,
} from '..';

import { validateOptions, isUndefined } from '.';

const normalizePatterns = (patterns: StyleResourcesLoaderOptions['patterns']) =>
    Array.isArray(patterns) ? patterns : [patterns];

const normalizeInjector = (injector: StyleResourcesLoaderOptions['injector']): StyleResourcesNormalizedInjector => {
    if (isUndefined(injector) || injector === 'prepend') {
        return (source, resources) => resources.map(({ content }) => content).join('') + source;
    }

    if (injector === 'append') {
        return (source, resources) => source + resources.map(({ content }) => content).join('');
    }

    return injector;
};

function normalizeOptions(this: LoaderContext): StyleResourcesLoaderNormalizedOptions {
    const options = getOptions(this) || {};

    /* istanbul ignore if: not possible to test */
    if (!validateOptions(options)) {
        throw new TypeError(
            '[style-resources-loader] This error is caused by a bug in options validator. '
             + 'Please file an issue: https://github.com/yenshih/style-resources-loader/issues.',
        );
    }

    const {
        patterns,
        injector,
        globOptions = {},
        resolveUrl = true,
    } = options;

    return {
        patterns: normalizePatterns(patterns),
        injector: normalizeInjector(injector),
        globOptions,
        resolveUrl,
    };
}

export default normalizeOptions;
