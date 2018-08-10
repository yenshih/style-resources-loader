import fs from 'fs';
import util from 'util';

import glob from 'glob';

import { LoaderContext, StyleResource, StyleResources, StyleResourcesLoaderNormalizedOptions } from '..';

import { isStyleFile, resolveImportUrl } from '.';

async function getResources(
    this: LoaderContext,
    options: StyleResourcesLoaderNormalizedOptions,
) {
    const { patterns, globOptions, resolveUrl } = options;

    const resourceFragments = await Promise.all(patterns
        // We can change `map` to `flatMap` when `Array.prototype.flatMap` is fully supported.
        .map(async (pattern) => {
            const partialFiles = (await util.promisify(glob)(pattern, globOptions)).filter(isStyleFile);

            partialFiles.forEach(this.dependency.bind(this));

            const partialResources: StyleResources = await Promise.all(partialFiles.map(async (file) => {
                const content = await util.promisify(fs.readFile)(file, 'utf8');
                const resource: StyleResource = { file, content };

                return resolveUrl
                    ? {
                        file,
                        content: Reflect.apply(resolveImportUrl, this, [resource]),
                    }
                    : resource;
            }));

            return partialResources;
        }));

    const emptyResources: StyleResources = [];
    const resources = emptyResources.concat(...resourceFragments);

    return resources;
}

export default getResources;
