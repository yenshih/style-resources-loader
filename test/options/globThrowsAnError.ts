import * as path from 'path';

import { StyleResourcesFileExt, StyleResourcesLoaderOriginalOptions } from '../../src';

export default (ext: StyleResourcesFileExt): StyleResourcesLoaderOriginalOptions => ({
    patterns: path.resolve('/**'),
    globOptions: {
        silent: true,
        strict: true,
    },
});
