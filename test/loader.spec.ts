import {SUPPORTED_FILE_FORMATS, LOADER_NAME, VALIDATION_BASE_DATA_PATH} from '../src/utils';

import {execTestOf} from './helpers';

describe('style-resources-loader', () => {
    describe('enviroments', () => {
        describe('errors', () => {
            it('should cause an error in synchronous loader environments', async () => {
                const styleResourcesLoader = (await import('../src')).default;

                const loaderContextMock = {
                    async: Function.prototype,
                    cacheable: Function.prototype,
                    dependency: Function.prototype,
                };

                Reflect.defineProperty(loaderContextMock, 'options', {
                    get() {
                        throw new Error('webpack options are not allowed to be accessed anymore.');
                    },
                });

                try {
                    Reflect.apply(styleResourcesLoader, Object.create(loaderContextMock), []);
                } catch (err) {
                    expect(err).toMatchObject({
                        message: expect.stringContaining(
                            '[style-resources-loader] Synchronous compilation is not supported.',
                        ),
                    });
                }
            });
        });
    });

    SUPPORTED_FILE_FORMATS.forEach(format => {
        describe(format, () => {
            const execTest = execTestOf(format);

            describe('patterns', () => {
                it('should work with a string', execTest('string-pattern'));
                it('should work with an array of string', execTest('array-of-string-patterns'));
                it('should support file globbing', execTest('file-globbing'));
            });

            describe('injector', () => {
                it('should work with customized function', execTest('customized-injector'));
                it('should work with asynchronous function', execTest('async-injector'));
                it('should work with `prepend`', execTest('prepend-injector'));
                it('should work with `append`', execTest('append-injector'));
            });

            describe('resolveUrl', () => {
                it('should resolve `@import` url correctly in a variety of different situations', execTest('imports'));
                it('should not resolve `@import` url when `options.resolveUrl` is falsy', execTest('no-resolve-url'));
            });

            describe('errors', () => {
                const VALIDATION_ERROR_MESSAGE =
                    `Invalid ${VALIDATION_BASE_DATA_PATH} object. ` +
                    `${LOADER_NAME} has been initialized using an ${VALIDATION_BASE_DATA_PATH} object ` +
                    'that does not match the API schema.';

                it(
                    'should cause an error when `options.patterns` is neither a string nor an array of string',
                    execTest('invalid-patterns', {}, err =>
                        expect(err).toMatchObject({
                            error: {
                                message: expect.stringContaining(
                                    [
                                        VALIDATION_ERROR_MESSAGE,
                                        " - options misses the property 'patterns'. Should be:",
                                        '   string | [string, ...] (should not have duplicate items)',
                                    ].join('\n'),
                                ),
                            },
                        }),
                    ),
                );
                it(
                    "should cause an error when `options.injector` isn't a function or `prepend`, `append`",
                    execTest('invalid-injector', {}, err =>
                        expect(err).toMatchObject({
                            error: {
                                message: expect.stringContaining(
                                    [
                                        VALIDATION_ERROR_MESSAGE,
                                        ' - options.injector should be one of these:',
                                        '   "prepend" | "append" | function',
                                        '   Details:',
                                        '    * options.injector should be one of these:',
                                        '      "prepend" | "append"',
                                        '    * options.injector should be an instance of function.',
                                    ].join('\n'),
                                ),
                            },
                        }),
                    ),
                );
                it(
                    "should cause an error when `options.globOptions` isn't an object",
                    execTest('invalid-glob-options', {}, err =>
                        expect(err).toMatchObject({
                            error: {
                                message: expect.stringContaining(
                                    [
                                        VALIDATION_ERROR_MESSAGE,
                                        ' - options.globOptions should be an object:',
                                        '   object { … }',
                                    ].join('\n'),
                                ),
                            },
                        }),
                    ),
                );
                it(
                    "should cause an error when `options.resolveUrl` isn't a boolean",
                    execTest('invalid-resolve-url', {}, err =>
                        expect(err).toMatchObject({
                            error: {
                                message: expect.stringContaining(
                                    [VALIDATION_ERROR_MESSAGE, ' - options.resolveUrl should be a boolean.'].join('\n'),
                                ),
                            },
                        }),
                    ),
                );
                it(
                    'should cause an error when `glob(...)` throws an error',
                    execTest('glob-throws-an-error', {}, err =>
                        expect(err).toMatchObject({
                            message: expect.stringContaining('Error: EACCES: permission denied'),
                        }),
                    ),
                );
                it(
                    'should cause an error when `options.injector(...)` returns neither a string nor a Buffer',
                    execTest('invalid-injector-return', {}, err =>
                        expect(err).toMatchObject({
                            message: expect.stringContaining(
                                'Error: [style-resources-loader] ' +
                                    'Expected options.injector(...) returns a string. ' +
                                    'Instead received number.',
                            ),
                        }),
                    ),
                );
                it(
                    'should cause an error when `options.injector(...)` throws an error',
                    execTest('injector-throws-an-error', {}, err =>
                        expect(err).toMatchObject({
                            message: expect.stringContaining('Error: This error is thrown from injector.'),
                        }),
                    ),
                );
            });
        });
    });
});
