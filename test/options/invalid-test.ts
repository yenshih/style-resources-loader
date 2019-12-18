import path from 'path';

import {StyleResourcesFileFormat} from '../../src';

export default (format: StyleResourcesFileFormat) => ({
    test: 0,
    patterns: [
        path.resolve(__dirname, `../${format}/variables/*.${format}`),
        path.resolve(__dirname, `../${format}/mixins/*.${format}`),
    ],
});
