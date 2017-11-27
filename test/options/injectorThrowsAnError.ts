import * as path from 'path';

import { StyleResourcesFileExt } from '../../src';

export default (ext: StyleResourcesFileExt) => ({
    patterns: [
        path.resolve(__dirname, `../${ext}/variables/*.${ext}`),
        path.resolve(__dirname, `../${ext}/mixins/*.${ext}`),
    ],
    injector: () => {
        throw new Error('This error is thrown from injector.');
    },
});
