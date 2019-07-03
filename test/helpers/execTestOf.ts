import {Configuration} from 'webpack';
import merge from 'webpack-merge';

import {StyleResourcesFileExt} from '../../src';
import {isFunction} from '../../src/utils';

import {createBaseConfigOf, readStyleOf, runWebpack} from '.';

const execTestOf = (ext: StyleResourcesFileExt) => {
    const createBaseConfig = createBaseConfigOf(ext);
    const readStyle = readStyleOf(ext);

    const execTest = (testId: string, config: Configuration = {}, assertError?: (err: Error) => void) => async () => {
        const baseConfig = await createBaseConfig(testId, !!assertError);

        try {
            await runWebpack(merge(baseConfig, config));
        } catch (err) {
            if (!isFunction(assertError)) {
                throw new Error(
                    `${err.message}\nTest \`${testId}\` throws an error. ` +
                        'It requires an `assertError` function as the second argument in `execTest(...)`.',
                );
            }
            assertError(err);

            return;
        }

        const actualStyle = (await import(`../${ext}/outputs/${testId}`)).default;
        const expectedStyle = await readStyle(testId);

        expect(actualStyle).toBe(expectedStyle);
    };

    return execTest;
};

export default execTestOf;
