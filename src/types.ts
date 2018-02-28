import * as glob from 'glob';

export type StyleResourcesFileExt = 'sass' | 'scss' | 'less' | 'styl';

export interface StyleResource {
    file: string;
    content: string;
}

export type StyleResources = ReadonlyArray<StyleResource>;

export type StyleResourcesInjector = (source: string | Buffer, resources: StyleResources) => string;

export interface StyleResourcesSpecialInjectors {
    prepend: StyleResourcesInjector;
    append: StyleResourcesInjector;
}

export interface StyleResourcesLoaderCommonOptions<I> {
    patterns: string | string[];
    injector: I;
    globOptions: glob.IOptions;
    resolveUrl: boolean;
}

export type StyleResourcesLoaderOptions = StyleResourcesLoaderCommonOptions<StyleResourcesInjector>;

export type StyleResourcesLoaderOriginalOptions = Partial<
    StyleResourcesLoaderCommonOptions<
        StyleResourcesInjector | keyof StyleResourcesSpecialInjectors
    >
>;
