import type {StyleResourcesFileFormat, StyleResourcesLoaderOptions} from '../../src';

export default (format: StyleResourcesFileFormat): StyleResourcesLoaderOptions => ({
    patterns: [`./${format}/variables/*.${format}`, `./${format}/mixins/*.${format}`],
});
