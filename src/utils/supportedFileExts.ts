import { StyleResourcesFileExt } from '../';

export const supportedFileExts: ReadonlyArray<StyleResourcesFileExt> = ['sass', 'scss', 'less', 'styl'];

export const supportedFileExtsWithDot = supportedFileExts.map(ext => `.${ext}`);
