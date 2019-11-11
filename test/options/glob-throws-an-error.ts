import path from 'path';

import {StyleResourcesLoaderOptions} from '../../src';

export default (): StyleResourcesLoaderOptions => ({
    patterns: path.resolve('/**'),
    globOptions: {
        silent: true,
        strict: true,
    },
});
