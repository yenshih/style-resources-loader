import path from 'path';

import {StyleResourcesFileFormat, StyleResourcesLoaderOptions} from '../../src';

export default (format: StyleResourcesFileFormat): StyleResourcesLoaderOptions => ({
    patterns: [
        path.resolve(__dirname, `../${format}/variables/*.${format}`),
        path.resolve(__dirname, `../${format}/mixins/*.${format}`),
    ],
    injector: (source, resources) => {
        const combineAll = (type: string) =>
            resources
                .filter(({file}) => file.includes(type))
                .map(({content}) => (content.endsWith('\n') ? content : `${content}\n`))
                .join('');

        return combineAll('mixins') + source + combineAll('variables');
    },
});
