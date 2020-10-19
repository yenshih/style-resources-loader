import path from 'path';

import type {StyleResourcesFileFormat} from '../../src';

export default (format: StyleResourcesFileFormat) => ({
    patterns: [
        path.resolve(__dirname, `../${format}/variables/*.${format}`),
        path.resolve(__dirname, `../${format}/mixins/*.${format}`),
    ],
    injector: () => {
        throw new Error('This error is thrown from injector.');
    },
});
