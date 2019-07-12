import fs from 'fs';
import path from 'path';
import util from 'util';

import glob from 'glob';

import {LoaderContext, StyleResource, StyleResources, StyleResourcesLoaderNormalizedOptions} from '..';

import {isStyleFile, resolveImportUrl} from '.';

const isLegacyWebpack = (ctx: any): ctx is {options: {context: string}} => !!ctx.options;

const getRootContext = (ctx: LoaderContext) => (isLegacyWebpack(ctx) ? ctx.options.context : ctx.rootContext);

const getResources = async (ctx: LoaderContext, options: StyleResourcesLoaderNormalizedOptions) => {
    const {patterns, globOptions, resolveUrl} = options;

    const resourceFragments = await Promise.all(
        patterns
            // We can change `map` to `flatMap` when `Array.prototype.flatMap` is fully supported.
            .map(async pattern => {
                const rootContext = getRootContext(ctx);
                const absolutePattern = path.isAbsolute(pattern) ? pattern : path.resolve(rootContext, pattern);
                const partialFiles = (await util.promisify(glob)(absolutePattern, globOptions)).filter(isStyleFile);

                partialFiles.forEach(ctx.dependency.bind(ctx));

                const partialResources: StyleResources = await Promise.all(
                    partialFiles.map(async file => {
                        const content = await util.promisify(fs.readFile)(file, 'utf8');
                        const resource: StyleResource = {file, content};

                        return resolveUrl ? {file, content: resolveImportUrl(ctx, resource)} : resource;
                    }),
                );

                return partialResources;
            }),
    );

    const emptyResources: StyleResources = [];
    const resources = emptyResources.concat(...resourceFragments);

    return resources;
};

export default getResources;
