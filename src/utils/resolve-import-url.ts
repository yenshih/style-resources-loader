/* eslint-disable prefer-named-capture-group */
import path from 'path';

import type {LoaderContext, StyleResource} from '../types';

const regexImport = /@(?:import|require)\s+(?:\([a-z,\s]+\)\s*)?['"]?([^'"\s;]+)['"]?;?/gu;
const regexUrl = /url\(['"]?([^'"\s;]+)['"]?\)/gu;

export const resolveImportUrl = (ctx: LoaderContext, {file, content}: StyleResource): StyleResource => ({
    file,
    content: content
        .replace(regexImport, (match: string, pathToResource?: string) => {
            if (!pathToResource || /^[~/]/u.test(pathToResource)) {
                return match;
            }

            const absolutePathToResource = path.resolve(path.dirname(file), pathToResource);
            const relativePathFromContextToResource = path
                .relative(ctx.context, absolutePathToResource)
                .split(path.sep)
                .join('/');

            return match.replace(pathToResource, relativePathFromContextToResource);
        })
        .replace(regexUrl, (content: string, pathToResource?: string) => {
            if (!pathToResource || /^(?:http|data:|~|\/)/u.test(pathToResource)) {
                return content;
            }

            const absolutePathToResource = path.resolve(path.dirname(file), pathToResource);

            const relativePathFromContextToResource = path
                .relative(ctx.context, absolutePathToResource)
                .split(path.sep)
                .join('/');

            return content.replace(pathToResource, relativePathFromContextToResource);
        }),
});
