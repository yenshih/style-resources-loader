import { Configuration } from 'webpack';
import merge from 'webpack-merge';

import { StyleResourcesFileExt } from '../../src';

import { createBaseConfigOf, readStyleOf, runWebpack } from '.';

const execTestOf = (ext: StyleResourcesFileExt) => {
    const createBaseConfig = createBaseConfigOf(ext);
    const readStyle = readStyleOf(ext);

    function execTest(testId: string, config?: Configuration): () => Promise<void>;
    function execTest(testId: string, assertError?: (err: Error) => void): () => Promise<void>;
    function execTest(testId: string, config: Configuration, assertError: (err: Error) => void): () => Promise<void>;
    function execTest(testId: string, ...args: any[]): () => Promise<void> {
        const [config, assertError]: [Configuration, (err: Error) => void] = (
            (args: any[]): any => typeof args[0] === 'function' ? [{}, args[0]] : args
        )(args);

        return async () => {
            const baseConfig = await createBaseConfig(testId, !!assertError);

            try {
                await runWebpack(merge(baseConfig, config));
            }
            catch (err) {
                if (typeof assertError !== 'function') {
                    throw new Error(
                        `${err.message}\nTest \`${testId}\` throws an error. `
                        + 'It requires an `assertError` function as the second argument in `execTest(...)`.',
                    );
                }
                assertError(err);

                return;
            }

            const actualStyle = (await import(`../${ext}/outputs/${testId}`)).default;
            const expectedStyle = await readStyle(testId);

            expect(actualStyle).toBe(expectedStyle);
        };
    }

    return execTest;
};

export default execTestOf;
