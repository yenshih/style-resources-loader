import * as path from 'path';

import { StyleResourcesFileExt, StyleResourcesLoaderOriginalOptions } from '../../src';

export default (ext: StyleResourcesFileExt): StyleResourcesLoaderOriginalOptions => ({
    patterns: path.resolve(__dirname, `../${ext}/resources/*.${ext}`),
    resolveUrl: false,
});
