import fs from 'fs';
import path from 'path';
import util from 'util';

import type {StyleResourcesFileFormat} from '../../src';

export const readStyleOf = (format: StyleResourcesFileFormat) => (testId: string) =>
    util.promisify(fs.readFile)(path.resolve(__dirname, `../${format}/specs/${testId}.${format}`), 'utf8');
