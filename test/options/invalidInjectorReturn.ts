import path from 'path';

import {StyleResourcesFileExt} from '../../src';

const ARBITRARY_NUMBER = 0;

export default (ext: StyleResourcesFileExt) => ({
    patterns: [
        path.resolve(__dirname, `../${ext}/variables/*.${ext}`),
        path.resolve(__dirname, `../${ext}/mixins/*.${ext}`),
    ],
    injector: () => ARBITRARY_NUMBER,
});
