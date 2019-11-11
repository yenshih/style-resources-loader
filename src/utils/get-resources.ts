import fs from 'fs';
import util from 'util';

import {LoaderContext, StyleResource, StyleResourcesLoaderNormalizedOptions} from '..';

import {matchFiles, resolveImportUrl} from '.';

export const getResources = async (ctx: LoaderContext, options: StyleResourcesLoaderNormalizedOptions) => {
    const {resolveUrl} = options;

    const files = await matchFiles(ctx, options);

    files.forEach(file => ctx.dependency(file));

    const resources = await Promise.all(
        files.map(async file => {
            const content = await util.promisify(fs.readFile)(file, 'utf8');
            const resource: StyleResource = {file, content};

            return resolveUrl ? resolveImportUrl(ctx, resource) : resource;
        }),
    );

    return resources;
};
