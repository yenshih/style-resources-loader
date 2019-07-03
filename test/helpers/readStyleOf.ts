import fs from 'fs';
import path from 'path';
import util from 'util';

import {StyleResourcesFileExt} from '../../src';

const readStyleOf = (ext: StyleResourcesFileExt) => (testId: string) =>
    util.promisify(fs.readFile)(path.resolve(__dirname, `../${ext}/specs/${testId}.${ext}`), 'utf8');

export default readStyleOf;
