import path from 'path';

import {StyleResourcesFileExt, StyleResourcesLoaderOptions} from '../../src';

export default (ext: StyleResourcesFileExt): StyleResourcesLoaderOptions => ({
    patterns: path.resolve(__dirname, `../${ext}/resources/*.${ext}`),
});
