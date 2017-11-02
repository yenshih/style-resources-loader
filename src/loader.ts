import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import * as glob from 'glob';
import { loader } from 'webpack';
import { getOptions } from 'loader-utils';

export type StyleResourceInjectorKeys = 'prepend' | 'append';

export type StyleResourcesInjector = (source: string | Buffer, resource: string) => string;

export type StyleResourcesLoaderOptions = Partial<{
    resources: string | string[];
    injector: StyleResourceInjectorKeys | StyleResourcesInjector;
}>;

const loader: loader.Loader = function (source) {
    this.cacheable && this.cacheable();

    const callback = this.async();
    if (!callback) {
        return this.callback(new Error('style-resources-loader: Asynchronous loader is not supported.'));
    }

    const isString = (arg: any): arg is string => typeof arg === 'string';

    const { resources, injector = 'prepend' }: StyleResourcesLoaderOptions = getOptions(this) || {};

    if (!isString(resources) && !(Array.isArray(resources) && resources.every(isString))) {
        return callback(new Error(
            'style-resources-loader: Expected options.resources to be a string or an array of string.'
            + ` Instead received ${resources}: ${typeof resources}.`,
        ));
    }

    if (isString(injector) ? !['prepend', 'append'].includes(injector) : typeof injector !== 'function') {
        return callback(new Error(
            'style-resources-loader: Expected options.resources to be `prepend`, `append` or a function.'
            + ` Instead received ${injector}: ${typeof injector}.`,
        ));
    }

    const { context = process.cwd() } = this.options;

    const files = (isString(resources)
        ? glob.sync(resources)
        : ([] as string[]).concat(...resources.map(resource => glob.sync(resource))))
        .map(resource => path.resolve(context, resource));

    files.forEach(this.addDependency.bind(this));

    Promise.all(files.map(async (file) => {
        const content = await util.promisify(fs.readFile)(file, 'utf8');
        if (!/\.(?:s[ac]|le)ss$/i.test(file)) {
            return content;
        }
        return content.replace(/@import\s+(?:'([^'])+'|"([^"])"|([^\s"';]))/g, (match, single, double, unquote) => {
            const absolutePath = path.resolve(path.dirname(file), single || double || unquote);
            const relativePath = path.relative(this.context, absolutePath);
            const quote = (match.match(/['"]$/) || [''])[0];
            return `@import ${quote}${relativePath}${quote}`;
        });
    })).then((contents) => {
        const resource = contents.join('\n');
        if (typeof injector === 'function') {
            try {
                return callback(null, injector(source, resource));
            } catch (err) {
                return callback(err);
            }
        }
        switch (injector) {
            case 'prepend': return callback(null, resource + source);
            case 'append': return callback(null, source + resource);
        }
    });
};

export default loader;
