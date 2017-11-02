import { readFile } from 'fs';
import { resolve, relative, dirname } from 'path';
import { promisify } from 'util';

import { loader } from 'webpack';
import { getOptions } from 'loader-utils';
import { sync } from 'glob';

export type StyleResourcesLoaderInjectorKeys = 'prepend' | 'append';

export type StyleResourcesLoaderInjector = (source: string | Buffer, resource: string) => string;

export type StyleResourcesLoaderOptions = Partial<{
    resources: string | ReadonlyArray<string>;
    injector: StyleResourcesLoaderInjectorKeys | StyleResourcesLoaderInjector;
}>;

const loader: loader.Loader = function (source) {
    this.cacheable && this.cacheable();

    const callback = this.async();
    if (!callback) {
        return this.callback(new Error('style-resources-loader: Asynchronous loader is not supported.'));
    }

    const { resources, injector = 'prepend' }: StyleResourcesLoaderOptions = getOptions(this);
    if (!resources) {
        return callback(new Error(
            'style-resources-loader: Expected options.resources to be a string or an array of string.'
            + ` Instead received: ${typeof resources}.`,
        ));
    }

    const context = this.options.context || process.cwd();

    const files = (typeof resources === 'string'
        ? sync(resources)
        : ([] as string[]).concat(...resources.map(resource => sync(resource))))
        .map(resource => resolve(context, resource));

    files.forEach(this.addDependency.bind(this));

    Promise.all(files.map(async (file) => {
        const content = await promisify(readFile)(file, 'utf8');
        if (!/\.(?:s[ac]|le)ss$/i.test(file)) {
            return content;
        }
        return content.replace(/@import\s+(?:'([^'])+'|"([^"])"|([^\s"';]))/g, (match, single, double, unquote) => {
            const absolutePath = resolve(dirname(file), single || double || unquote);
            const relativePath = relative(this.context, absolutePath);
            const quote = (match.match(/['"]$/) || [''])[0];
            return `@import ${quote}${relativePath}${quote}`;
        });
    })).then((contents) => {
        const resource = contents.join('\n') + '\n';
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
