import fs from 'fs';
import {EOL} from 'os';
import path from 'path';
import util from 'util';

import {StyleResourcesFileFormat, StyleResourcesLoaderOptions} from '../../src';

export default (format: StyleResourcesFileFormat): StyleResourcesLoaderOptions => ({
    patterns: [
        path.resolve(__dirname, `../${format}/variables/*.${format}`),
        path.resolve(__dirname, `../${format}/mixins/*.${format}`),
    ],
    injector: async (source, resources) => {
        const readFile = util.promisify(fs.readFile);
        const combineAll = async (type: string) =>
            (
                await Promise.all(
                    resources.filter(({file}) => file.includes(type)).map(({file}) => readFile(file, 'utf8')),
                )
            )
                .map(content => (content.endsWith(EOL) ? content : `${content}${EOL}`))
                .join('');
        const [mixins, variables] = await Promise.all([combineAll('mixins'), combineAll('variables')]);

        return mixins + source + variables;
    },
});
