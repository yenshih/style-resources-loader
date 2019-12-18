import path from 'path';

import {StyleResourcesFileFormat, StyleResourcesLoaderOptions} from '../../src';

export default (format: StyleResourcesFileFormat): StyleResourcesLoaderOptions => ({
    test: filename => {
        return typeof filename === 'string' && filename.includes('.css');
    },
    patterns: path.resolve(__dirname, `../${format}/resources/*.${format}`),
});
