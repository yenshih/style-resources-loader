import {StyleResourcesFileFormat, StyleResourcesLoaderOptions} from '../../src';

export default (format: StyleResourcesFileFormat): StyleResourcesLoaderOptions => ({
    test: '.',
    patterns: `./${format}/resources.${format}`,
});
