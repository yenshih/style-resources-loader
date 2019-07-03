import {StyleResourcesFileExt} from '..';

export const supportedFileExts: StyleResourcesFileExt[] = ['css', 'sass', 'scss', 'less', 'styl'];

export const supportedFileExtsWithDot = supportedFileExts.map(ext => `.${ext}`);
