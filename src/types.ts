import * as glob from 'glob';

export type StyleResourcesFileExt = 'sass' | 'scss' | 'less' | 'styl';

export interface StyleResource {
    file: string;
    content: string;
}

export type StyleResources = ReadonlyArray<StyleResource>;

export type StyleResourcesInjector = (source: string | Buffer, resources: StyleResources) => string;

export interface StyleResourcesLoaderOptions {
    patterns: string | string[];
    injector: StyleResourcesInjector;
    globOptions: glob.IOptions;
    resolveUrl: boolean;
}

export type StyleResourcesLoaderOriginalOptions = Partial<StyleResourcesLoaderOptions>;
