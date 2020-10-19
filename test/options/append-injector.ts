import path from 'path';

import type {StyleResourcesFileFormat, StyleResourcesLoaderOptions} from '../../src';

export default (format: StyleResourcesFileFormat): StyleResourcesLoaderOptions => ({
    patterns: path.resolve(__dirname, `../${format}/resources/*.${format}`),
    injector: 'append',
});
