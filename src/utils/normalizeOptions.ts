import {EOL} from 'os';

import {getOptions} from 'loader-utils';

import {
    LoaderContext,
    StyleResource,
    StyleResourcesNormalizedInjector,
    StyleResourcesLoaderOptions,
    StyleResourcesLoaderNormalizedOptions,
} from '..';

import {validateOptions, isUndefined, throwImpossibleError} from '.';

const normalizePatterns = (patterns: StyleResourcesLoaderOptions['patterns']) =>
    Array.isArray(patterns) ? patterns : [patterns];

const getResourceContent = ({content}: StyleResource) => (content.endsWith(EOL) ? content : `${content}${EOL}`);

const normalizeInjector = (injector: StyleResourcesLoaderOptions['injector']): StyleResourcesNormalizedInjector => {
    if (isUndefined(injector) || injector === 'prepend') {
        return (source, resources) => resources.map(getResourceContent).join('') + source;
    }

    if (injector === 'append') {
        return (source, resources) => source + resources.map(getResourceContent).join('');
    }

    return injector;
};

const normalizeOptions = (ctx: LoaderContext): StyleResourcesLoaderNormalizedOptions => {
    const options = getOptions(ctx) || {};

    /* istanbul ignore if: not possible to test */
    if (!validateOptions(options)) {
        return throwImpossibleError();
    }

    const {patterns, injector, globOptions = {}, resolveUrl = true} = options;

    return {
        patterns: normalizePatterns(patterns),
        injector: normalizeInjector(injector),
        globOptions,
        resolveUrl,
    };
};

export default normalizeOptions;
