import * as fs from 'fs';
import * as path from 'path';

import * as glob from 'glob';
import { loader } from 'webpack';
import { getOptions } from 'loader-utils';

export interface StyleResource {
    file: string;
    content: string;
}

export type StyleResources = ReadonlyArray<StyleResource>;

export type StyleResourcesInjector = (source: string | Buffer, resources: StyleResources) => string;

export type StyleResourcesLoaderOptions = Partial<{
    patterns: string | string[];
    injector: StyleResourcesInjector;
}>;

const loader: loader.Loader = function (source) {
    this.cacheable && this.cacheable();

    const callback = this.async();

    if (!callback) {
        return this.callback(new Error('style-resources-loader: Asynchronous webpack loader is not supported.'));
    }

    const defaultInjector: StyleResourcesInjector = (source, resources) =>
        resources.map(({ content }) => content).join('\n') + source;

    const { patterns, injector = defaultInjector }: StyleResourcesLoaderOptions = getOptions(this) || {};

    const isString = (arg: any): arg is string => typeof arg === 'string';

    if (!isString(patterns) && !(Array.isArray(patterns) && patterns.every(isString))) {
        return callback(new Error(
            'style-resources-loader: Expected options.patterns to be a string or an array of string.'
            + ` Instead received ${typeof patterns}: ${patterns}.`,
        ));
    }

    if (typeof injector !== 'function') {
        return callback(new Error(
            'style-resources-loader: Expected options.injector to be a function.'
            + ` Instead received ${typeof injector}: ${injector}.`,
        ));
    }

    const { context = process.cwd() } = this.options;

    const files = (isString(patterns) ? [patterns] : patterns)
        .map(resource => glob.sync(resource).filter(file => /\.(?:s[ac]|le)ss$/i.test(file)))
        .reduce((files, partialFiles) => files.concat(partialFiles))
        .map(file => path.resolve(context, file));

    files.forEach(this.addDependency.bind(this));

    const resources: StyleResources = files.map(file => ({
        file,
        content: fs.readFileSync(file, 'utf8').replace(
            /@import\s+(?:'([^'])+'|"([^"])"|([^\s"';]))/g,
            (match, single, double, unquote) => {
                const absolutePath = path.resolve(path.dirname(file), single || double || unquote);
                const relativePath = path.relative(this.context, absolutePath);
                const quote = (match.match(/['"]$/) || [''])[0];
                return `@import ${quote}${relativePath}${quote}`;
            },
        ),
    }));

    try {
        return callback(null, injector(source, resources));
    } catch (err) {
        return callback(err);
    }
};

export default loader;
