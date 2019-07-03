import path from 'path';

import {LoaderContext, StyleResource} from '..';

const resolveImportUrl = (ctx: LoaderContext, {file, content}: StyleResource) =>
    /* eslint-disable-next-line prefer-named-capture-group */
    content.replace(/(@import|@require)(\s+(?:\([a-z,\s]+\)\s*)?)(?:'([^']+)'|"([^"]+)"|([^\s"';]+))/gu, (
        match: string,
        importDeclaration: string,
        spacingOrOptions: string,
        single: string | undefined,
        double: string | undefined,
        unquoted: string | undefined,
        /* eslint-disable-next-line max-params */
    ) => {
        const pathToResource = single || double || unquoted;

        if (!pathToResource || /^[~/]/u.test(pathToResource)) {
            return match;
        }

        const absolutePathToResource = path.resolve(path.dirname(file), pathToResource);
        const relativePathFromContextToResource = path
            .relative(ctx.context, absolutePathToResource)
            .split(path.sep)
            .join('/');
        const [quote] = /['"]$/u.exec(match) || [''];

        return `${importDeclaration}${spacingOrOptions}${quote}${relativePathFromContextToResource}${quote}`;
    });

export default resolveImportUrl;
