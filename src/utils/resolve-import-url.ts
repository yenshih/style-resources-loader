import path from 'path';

import {LoaderContext, StyleResource} from '..';

const regex = /@(?:import|require)\s+(?:\([a-z,\s]+\)\s*)?['"]?(?<pathToResource>[^'"\s;]+)['"]?;?/gu;

export const resolveImportUrl = (ctx: LoaderContext, {file, content}: StyleResource): StyleResource => ({
    file,
    content: content.replace(regex, (match: string, pathToResource?: string) => {
        if (!pathToResource || /^[~/]/u.test(pathToResource)) {
            return match;
        }

        const absolutePathToResource = path.resolve(path.dirname(file), pathToResource);
        const relativePathFromContextToResource = path
            .relative(ctx.context, absolutePathToResource)
            .split(path.sep)
            .join('/');

        return match.replace(pathToResource, relativePathFromContextToResource);
    }),
});
