import {StyleResourcesFileExt, StyleResourcesLoaderOptions} from '../../src';

export default (ext: StyleResourcesFileExt): StyleResourcesLoaderOptions => ({
    patterns: [`./${ext}/variables/*.${ext}`, `./${ext}/mixins/*.${ext}`],
});
