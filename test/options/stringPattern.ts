import {StyleResourcesFileExt, StyleResourcesLoaderOptions} from '../../src';

export default (ext: StyleResourcesFileExt): StyleResourcesLoaderOptions => ({
    patterns: `./${ext}/resources.${ext}`,
});
