import fs from 'fs';
import path from 'path';
import util from 'util';

import {StyleResourcesFileExt, StyleResourcesLoaderOptions} from '../../src';

export default (ext: StyleResourcesFileExt): StyleResourcesLoaderOptions => ({
    patterns: [
        path.resolve(__dirname, `../${ext}/variables/*.${ext}`),
        path.resolve(__dirname, `../${ext}/mixins/*.${ext}`),
    ],
    injector: async (source, resources) => {
        const readFile = util.promisify(fs.readFile);
        const combineAll = async (type: string) =>
            (await Promise.all(
                resources.filter(({file}) => file.includes(type)).map(({file}) => readFile(file, 'utf8')),
            )).join('');
        const [mixins, variables] = await Promise.all([combineAll('mixins'), combineAll('variables')]);

        return mixins + source + variables;
    },
});
