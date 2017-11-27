import * as path from 'path';

import { supportedFileExtsWithDot } from './';

export const isStyleFile = (file: string) => supportedFileExtsWithDot.includes(path.extname(file));
