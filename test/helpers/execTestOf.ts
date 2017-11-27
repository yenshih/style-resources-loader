import { StyleResourcesFileExt } from '../../src';

import { createBaseConfigOf, readStyleOf, runWebpackOf } from './';

export const execTestOf = (ext: StyleResourcesFileExt) => {
    const createBaseConfig = createBaseConfigOf(ext);
    const readStyle = readStyleOf(ext);
    const runWebpack = runWebpackOf(ext);
    return (testId: string, assertError?: (err: Error) => void) => async () => {
        const baseConfig = createBaseConfig(testId, !!assertError);
        try {
            await runWebpack(testId, baseConfig);
        } catch (err) {
            if (typeof assertError !== 'function') {
                throw new Error(
                    `Test \`${testId}\` throws an error. `
                    + 'It requires an `assertError` function as the second argument in `execTest(...).`',
                );
            }
            assertError(err);
            return;
        }
        const actualStyle = require(`../${ext}/outputs/${testId}`);
        const expectedStyle = readStyle(testId);
        expect(actualStyle).toBe(expectedStyle);
    };
};
