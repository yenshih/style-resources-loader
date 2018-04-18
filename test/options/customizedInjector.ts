import * as path from 'path';

import { StyleResourcesFileExt, StyleResourcesLoaderOriginalOptions } from '../../src';

export default (ext: StyleResourcesFileExt): StyleResourcesLoaderOriginalOptions => ({
    patterns: [
        path.resolve(__dirname, `../${ext}/variables/*.${ext}`),
        path.resolve(__dirname, `../${ext}/mixins/*.${ext}`),
    ],
    injector: (source, resources) => {
        const combineAll = (type: string) => resources
            .filter(({ file }) => file.includes(type))
            .map(({ content }) => content)
            .join('');

        return combineAll('mixins') + source + combineAll('variables');
    },
});
