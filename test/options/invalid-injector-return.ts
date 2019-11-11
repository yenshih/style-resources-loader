import path from 'path';

import {StyleResourcesFileFormat} from '../../src';

const ARBITRARY_NUMBER = 0;

export default (format: StyleResourcesFileFormat) => ({
    patterns: [
        path.resolve(__dirname, `../${format}/variables/*.${format}`),
        path.resolve(__dirname, `../${format}/mixins/*.${format}`),
    ],
    injector: () => ARBITRARY_NUMBER,
});
