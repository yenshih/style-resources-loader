import {loader} from 'webpack';
import glob from 'glob';

export type Loader = loader.Loader;

export type LoaderContext = loader.LoaderContext;

export type LoaderCallback = loader.loaderCallback;

export type StyleResourcesFileFormat = 'css' | 'sass' | 'scss' | 'less' | 'styl';

export interface StyleResource {
    file: string;
    content: string;
}

export type StyleResources = StyleResource[];

export type StyleResourcesFunctionalInjector = (source: string, resources: StyleResources) => string | Promise<string>;

export type StyleResourcesFunctionTest = (file: string) => boolean;

export type StyleResourcesInjector = 'prepend' | 'append' | StyleResourcesFunctionalInjector;

export type StyleResourcesTest = string | StyleResourcesFunctionTest | RegExp;

export type StyleResourcesNormalizedInjector = StyleResourcesFunctionalInjector;

export interface StyleResourcesLoaderOptions {
    test?: StyleResourcesTest;
    patterns: string | string[];
    injector?: StyleResourcesInjector;
    globOptions?: glob.IOptions;
    resolveUrl?: boolean;
}

export interface StyleResourcesLoaderNormalizedOptions extends NonNullable<StyleResourcesLoaderOptions> {
    patterns: string[];
    injector: StyleResourcesNormalizedInjector;
}
