import { loader } from 'webpack';
import glob from 'glob';

export type Loader = loader.Loader;

export type LoaderContext = loader.LoaderContext;

export type LoaderCallback = loader.loaderCallback;

export type StyleResourcesFileExt = 'css' | 'sass' | 'scss' | 'less' | 'styl';

export interface StyleResource {
    file: string;
    content: string;
}

export type StyleResources = ReadonlyArray<StyleResource>;

export type StyleResourcesFunctionalInjector = (source: string | Buffer, resources: StyleResources) =>
    string | Buffer | Promise<string | Buffer>;

export type StyleResourcesInjector = 'prepend' | 'append' | StyleResourcesFunctionalInjector;

export type StyleResourcesNormalizedInjector = StyleResourcesFunctionalInjector;

export interface StyleResourcesLoaderOptions {
    patterns: string | string[];
    injector?: StyleResourcesInjector;
    globOptions?: glob.IOptions;
    resolveUrl?: boolean;
}

export interface StyleResourcesLoaderNormalizedOptions {
    patterns: string[];
    injector: StyleResourcesNormalizedInjector;
    globOptions: glob.IOptions;
    resolveUrl: boolean;
}
