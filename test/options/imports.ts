import * as path from 'path';

import { StyleResourcesFileExt, StyleResourcesLoaderOriginalOptions } from '../../src';

export default (ext: StyleResourcesFileExt): StyleResourcesLoaderOriginalOptions => ({
    patterns: [
        path.resolve(__dirname, `../${ext}/resources/_mixins.${ext}`),
        path.resolve(__dirname, `../${ext}/resources/_variables.${ext}`),
    ],
});
