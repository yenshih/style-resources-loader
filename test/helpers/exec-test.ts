import type {Configuration} from 'webpack';
import merge from 'webpack-merge';

import type {StyleResourcesFileFormat} from '../../src';
import {isFunction} from '../../src/utils';

import {createBaseConfigOf} from './create-base-config';
import {injectVariable} from './inject-variable';
import {readStyleOf} from './read-style';
import {runWebpack} from './run-webpack';

export const execTestOf = (format: StyleResourcesFileFormat) => {
    const createBaseConfig = createBaseConfigOf(format);
    const readStyle = readStyleOf(format);

    const execTest =
        (testId: string, config: Configuration = {}, assertError: ((err: Error) => void) | null = null) =>
        async () => {
            const baseConfig = await createBaseConfig(testId, !!assertError);

            try {
                await runWebpack(merge(baseConfig, config));
            } catch (err) {
                if (!(err instanceof Error)) {
                    return;
                }

                const {message}: Error = err;

                if (!isFunction(assertError)) {
                    throw new Error(
                        `${message}\nTest \`${testId}\` throws an error. ` +
                            'It requires an `assertError` function as the second argument in `execTest(...)`.',
                    );
                }

                assertError(err);

                return;
            }

            const actualStyle = ((await import(`../${format}/outputs/${testId}`)) as {default: string}).default;
            const expectedStyle = injectVariable(await readStyle(testId), 'CWD', process.cwd());

            expect(actualStyle).toBe(expectedStyle);
        };

    return execTest;
};
