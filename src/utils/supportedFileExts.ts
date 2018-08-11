import { StyleResourcesFileExt } from '..';

export const supportedFileExts: ReadonlyArray<StyleResourcesFileExt> = ['css', 'sass', 'scss', 'less', 'styl'];

export const supportedFileExtsWithDot = supportedFileExts.map(ext => `.${ext}`);
