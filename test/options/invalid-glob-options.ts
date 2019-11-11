import path from 'path';

import {StyleResourcesFileFormat} from '../../src';

export default (format: StyleResourcesFileFormat) => ({
    patterns: [
        path.resolve(__dirname, `../${format}/variables/*.${format}`),
        path.resolve(__dirname, `../${format}/mixins/*.${format}`),
    ],
    globOptions: 0,
});
