import {strict as assert} from 'assert';
import {EOL} from 'os';
import path from 'path';

import type {StyleResourcesFileFormat, StyleResourcesLoaderOptions} from '../../src';

export default (format: StyleResourcesFileFormat): StyleResourcesLoaderOptions => ({
    patterns: [
        path.resolve(__dirname, `../${format}/variables/*.${format}`),
        path.resolve(__dirname, `../${format}/mixins/*.${format}`),
    ],
    injector(source, resources) {
        assert.strictEqual(this.version, 2);

        const combineAll = (type: string) =>
            resources
                .filter(({file}) => file.includes(type))
                .map(({content}) => (content.endsWith(EOL) ? content : `${content}${EOL}`))
                .join('');

        return combineAll('mixins') + source + combineAll('variables');
    },
});
