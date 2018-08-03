import path from 'path';

import { supportedFileExtsWithDot } from '.';

export const isString = (arg: any): arg is string => typeof arg === 'string';

export const isStyleFile = (file: string) => supportedFileExtsWithDot.includes(path.extname(file));
