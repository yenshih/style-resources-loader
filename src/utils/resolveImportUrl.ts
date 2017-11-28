import * as path from 'path';

import { loader } from 'webpack';

import { StyleResource } from '../';

export function resolveImportUrl(
    this: loader.LoaderContext,
    { file, content }: StyleResource,
): string {
    return content.replace(/(@import|@require)([()a-z,\s]+)(?:'([^']+)'|"([^"]+)"|([^\s"';]+))/g, (
        match: string,
        imports: string,
        options: string,
        single: string | undefined,
        double: string | undefined,
        unquoted: string | undefined,
    ) => {
        const pathToResource = single || double || unquoted;
        if (!pathToResource || /^[~/]/.test(pathToResource)) {
            return match;
        }
        const absolutePathToResource = path.resolve(path.dirname(file), pathToResource);
        const relativePathFromContextToResource = path.relative(this.context, absolutePathToResource);
        const quote = (match.match(/['"]$/) || [''])[0];
        return `${imports}${options}${quote}${relativePathFromContextToResource}${quote}`;
    });
}
