import path from 'path';

import type {StyleResourcesFileFormat, StyleResourcesLoaderOptions} from '../../src';

export default (format: StyleResourcesFileFormat): StyleResourcesLoaderOptions => ({
    patterns: [
        path.resolve(__dirname, `../${format}/mixins/size.${format}`),
        path.resolve(__dirname, `../${format}/variables/color.${format}`),
        path.resolve(__dirname, `../${format}/variables/font.${format}`),
    ],
});
