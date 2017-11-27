import * as path from 'path';

import { loader } from 'webpack';

import { StyleResource } from '../';

// TODO: rewrite this function to support complicated `@import` situations
export function resolveImportUrl(
    this: loader.LoaderContext,
    { file, content }: StyleResource,
): StyleResource {
    return {
        file,
        content: content.replace(
            /@import\s+(?:'([^']+)'|"([^"]+)"|([^\s"';]+))/g,
            (match, single, double, unquote) => {
                const absolutePath = path.resolve(path.dirname(file), single || double || unquote);
                const relativePath = path.relative(this.context, absolutePath);
                const quote = (match.match(/['"]$/) || [''])[0];
                return `@import ${quote}${relativePath}${quote}`;
            },
        ),
    };
}
