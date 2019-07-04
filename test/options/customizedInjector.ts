import {EOL} from 'os';
import path from 'path';

import {StyleResourcesFileExt, StyleResourcesLoaderOptions} from '../../src';

export default (ext: StyleResourcesFileExt): StyleResourcesLoaderOptions => ({
    patterns: [
        path.resolve(__dirname, `../${ext}/variables/*.${ext}`),
        path.resolve(__dirname, `../${ext}/mixins/*.${ext}`),
    ],
    injector: (source, resources) => {
        const combineAll = (type: string) =>
            resources
                .filter(({file}) => file.includes(type))
                .map(({content}) => (content.endsWith(EOL) ? content : `${content}${EOL}`))
                .join('');

        return combineAll('mixins') + source + combineAll('variables');
    },
});
