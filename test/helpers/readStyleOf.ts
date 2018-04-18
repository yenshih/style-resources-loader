import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import { StyleResourcesFileExt } from '../../src';

export const readStyleOf = (ext: StyleResourcesFileExt) => (testId: string) =>
    util.promisify(fs.readFile)(path.resolve(__dirname, `../${ext}/specs/${testId}.${ext}`), 'utf8');
