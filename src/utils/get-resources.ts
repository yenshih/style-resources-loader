import fs from 'fs';
import util from 'util';

import type {LoaderContext, StyleResource, StyleResourcesLoaderNormalizedOptions} from '../types';

import {matchFiles} from './match-files';
import {resolveImportUrl} from './resolve-import-url';

export const getResources = async (ctx: LoaderContext, options: StyleResourcesLoaderNormalizedOptions) => {
    const {resolveUrl} = options;

    const files = await matchFiles(ctx, options);

    files.forEach(file => ctx.dependency(file));

    const resources = await Promise.all(
        files.map(async file => {
            const content = await util.promisify(fs.readFile)(file, 'utf8');
            let resource: StyleResource = {file, content};

            if (resolveUrl) {
                resource = await resolveImportUrl(ctx, resource);
            }

            return resource;
        }),
    );

    return resources;
};
