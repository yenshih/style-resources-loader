/* eslint-disable prefer-named-capture-group */
import path from 'path';

import type {LoaderContext, StyleResource} from '../types';

const regexImport = /@(?:import|require)\s+(?:\([a-z,\s]+\)\s*)?['"]?([^'"\s;]+)['"]?;?/gu;
const regexUrl = /url\(['"]?([^'"\s;]+)['"]?\)/gu;

const promisify = (ctx: LoaderContext) => (context: string, request: string) =>
    new Promise<[Error, string]>(resolve => {
        ctx.resolve(context, request, (err, result) => {
            resolve([err, result]);
        });
    });

const resolvePossibleFiles = async (ctx: LoaderContext, file: string, pathToResource: string): Promise<string> => {
    // Possibly relative to resource file, or alias
    let [err, result] = await promisify(ctx)(file, pathToResource);

    if (err) {
        // Possibly relative to current file, or alias
        [err, result] = await promisify(ctx)(ctx.context, pathToResource);
    }

    if (err) {
        // Not emit error because maybe there are async injector
        result = path
            .relative(ctx.context, path.resolve(path.dirname(file), pathToResource))
            .split(path.sep)
            .join('/');
    }

    return result;
};

const asyncReplace = async (
    str: string,
    searchValue: RegExp,
    replacer: (substring: string, ...args: any[]) => Promise<string>,
) => {
    const tasks: Promise<string>[] = [];

    str.replace(searchValue, (match, ...args: unknown[]) => {
        tasks.push(replacer(match, ...args));

        return '';
    });

    const caches = await Promise.all(tasks);

    return str.replace(searchValue, () => caches.shift() ?? '');
};

export const resolveImportUrl = async (ctx: LoaderContext, {file, content}: StyleResource): Promise<StyleResource> => {
    let result = await asyncReplace(content, regexImport, async (match: string, pathToResource?: string) => {
        if (!pathToResource || /^[~/]/u.test(pathToResource)) {
            return match;
        }

        const filePath = await resolvePossibleFiles(ctx, file, pathToResource);

        return match.replace(pathToResource, filePath);
    });

    result = await asyncReplace(result, regexUrl, async (match: string, pathToResource?: string) => {
        if (!pathToResource || /^(?:http|data:|~|\/)/u.test(pathToResource)) {
            return match;
        }

        const filePath = await resolvePossibleFiles(ctx, file, pathToResource);

        return match.replace(pathToResource, filePath);
    });

    return {file, content: result};
};
