import {Configuration} from 'webpack';
import merge from 'webpack-merge';

import {StyleResourcesFileFormat} from '../../src';
import {isFunction} from '../../src/utils';

import {createBaseConfigOf, readStyleOf, runWebpack} from '.';

const execTestOf = (format: StyleResourcesFileFormat) => {
    const createBaseConfig = createBaseConfigOf(format);
    const readStyle = readStyleOf(format);

    const execTest = (
        testId: string,
        config: Configuration = {},
        assertError: ((err: Error) => void) | null = null,
    ) => async () => {
        const baseConfig = await createBaseConfig(testId, !!assertError);

        try {
            await runWebpack(merge(baseConfig, config));
        } catch (err) {
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

        const actualStyle = (await import(`../${format}/outputs/${testId}`)).default;
        const expectedStyle = await readStyle(testId);

        expect(actualStyle).toBe(expectedStyle);
    };

    return execTest;
};

export default execTestOf;
