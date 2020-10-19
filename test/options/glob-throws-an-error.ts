import path from 'path';

import type {StyleResourcesLoaderOptions} from '../../src';

export default (): StyleResourcesLoaderOptions => ({
    patterns: path.resolve('/**'),
    globOptions: {
        silent: true,
        strict: true,
    },
});
