import path from 'path';

import { StyleResourcesFileExt } from '../../src';

export default (ext: StyleResourcesFileExt) => ({
    patterns: path.resolve(__dirname, `../${ext}/variables/color.${ext}`),
    resolveUrl: () => false,
});
