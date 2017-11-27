import { StyleResourcesFileExt } from '../';

// TODO: support stylus
export const supportedFileExts: ReadonlyArray<StyleResourcesFileExt> = ['sass', 'scss', 'less'];

export const supportedFileExtsWithDot = supportedFileExts.map(ext => `.${ext}`);
