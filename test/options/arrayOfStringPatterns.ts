import path from 'path';

import {StyleResourcesFileExt, StyleResourcesLoaderOptions} from '../../src';

export default (ext: StyleResourcesFileExt): StyleResourcesLoaderOptions => ({
    patterns: [
        path.resolve(__dirname, `../${ext}/mixins/size.${ext}`),
        path.resolve(__dirname, `../${ext}/variables/color.${ext}`),
        path.resolve(__dirname, `../${ext}/variables/font.${ext}`),
    ],
});
