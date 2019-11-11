import path from 'path';

import {StyleResourcesFileFormat, StyleResourcesLoaderOptions} from '../../src';

export default (format: StyleResourcesFileFormat): StyleResourcesLoaderOptions => ({
    patterns: path.resolve(__dirname, `../${format}/resources/*.${format}`),
    injector: 'append',
});
