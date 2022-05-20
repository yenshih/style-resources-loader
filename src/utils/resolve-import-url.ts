/* eslint-disable prefer-named-capture-group */
import path from 'path';

import type {StyleResource} from '../types';

const regexImport = /@(?:import|require|use)\s+(?:\([a-z,\s]+\)\s*)?['"]?([^'"\s;]+)['"]?;?/gu;
const regexUrl = /url\(['"]?([^'"\s;]+)['"]?\)/gu;

export const resolveImportUrl = ({file, content}: StyleResource): StyleResource => {
    const result = content
        .replace(regexImport, (match: string, pathToResource?: string) => {
            if (!pathToResource || /^(?!\.{1,2}\/)/u.test(pathToResource)) {
                return match;
            }

            const absolutePathToResource = path.resolve(path.dirname(file), pathToResource);

            return match.replace(pathToResource, absolutePathToResource);
        })
        .replace(regexUrl, (match: string, pathToResource?: string) => {
            if (!pathToResource || /^(?!\.{1,2}\/)/u.test(pathToResource)) {
                return match;
            }

            const absolutePathToResource = path.resolve(path.dirname(file), pathToResource);

            return match.replace(pathToResource, absolutePathToResource);
        });

    return {file, content: result};
};
