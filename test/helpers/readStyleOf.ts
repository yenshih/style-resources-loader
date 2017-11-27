import * as fs from 'fs';
import * as path from 'path';

import { StyleResourcesFileExt } from '../../src';

export const readStyleOf = (ext: StyleResourcesFileExt) => (testId: string) =>
    fs.readFileSync(path.resolve(__dirname, `../${ext}/specs/${testId}.${ext}`), 'utf8');
