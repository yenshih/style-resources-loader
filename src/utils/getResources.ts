import * as fs from 'fs';
import * as util from 'util';

import * as glob from 'glob';

import { loader } from 'webpack';

import { StyleResource, StyleResources, StyleResourcesLoaderOptions } from '../';
import { isString, isStyleFile, resolveImportUrl } from './';

export async function getResources(
    this: loader.LoaderContext,
    options: StyleResourcesLoaderOptions,
) {
    const { patterns, globOptions, resolveUrl } = options;

    const resourceFragments = await Promise.all((isString(patterns) ? [patterns] : patterns)
        // We can change `map` to `flatMap` when `Array.prototype.flatMap` is fully supported.
        .map(async (pattern) => {
            // Type signature of `util.promisify` is not compatible with `glob`.
            // Not super happy with this approach.
            const partialFiles = await new Promise<ReadonlyArray<string>>((resolve, reject) =>
                glob(pattern, globOptions, (err, matches) => err ? reject(err) : resolve(matches.filter(isStyleFile))),
            );

            partialFiles.forEach(this.dependency.bind(this));

            const partialResources: StyleResources = await Promise.all(partialFiles.map(async (file) => {
                const content = await util.promisify(fs.readFile)(file, 'utf8');
                const resource: StyleResource = { file, content };
                return resolveUrl ? {
                    file,
                    content: resolveImportUrl.call(this, resource),
                } : resource;
            }));

            return partialResources;
        }),
    );

    const resources = ([] as StyleResources).concat(...resourceFragments);

    return resources;
}
