import fs from 'fs';
import path from 'path';
import util from 'util';

import {StyleResourcesFileFormat} from '../../src';

const readStyleOf = (format: StyleResourcesFileFormat) => (testId: string) =>
    util.promisify(fs.readFile)(path.resolve(__dirname, `../${format}/specs/${testId}.${format}`), 'utf8');

export default readStyleOf;
