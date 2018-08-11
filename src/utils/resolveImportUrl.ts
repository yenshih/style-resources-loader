import path from 'path';

import { LoaderContext, StyleResource } from '..';

function resolveImportUrl(
    this: LoaderContext,
    { file, content }: StyleResource,
) {
    /* eslint-disable-next-line max-params */
    return content.replace(/(@import|@require)(\s+(?:\([a-z,\s]+\)\s*)?)(?:'([^']+)'|"([^"]+)"|([^\s"';]+))/g, (
        match: string,
        importDeclaration: string,
        spacingOrOptions: string,
        single: string | undefined,
        double: string | undefined,
        unquoted: string | undefined,
    ) => {
        const pathToResource = single || double || unquoted;

        if (!pathToResource || /^[~/]/.test(pathToResource)) {
            return match;
        }

        const absolutePathToResource = path.resolve(path.dirname(file), pathToResource);
        const relativePathFromContextToResource = path.relative(this.context, absolutePathToResource)
            .split(path.sep)
            .join('/');
        const quote = (match.match(/['"]$/) || [''])[0];

        return `${importDeclaration}${spacingOrOptions}${quote}${relativePathFromContextToResource}${quote}`;
    });
}

export default resolveImportUrl;
