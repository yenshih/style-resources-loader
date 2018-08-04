import { supportedFileExts } from '../src/utils';

import { execTestOf } from './helpers';

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
                }
                catch (err) {
                    expect(err).toMatchObject({
                        message: expect.stringContaining(
                            '[style-resources-loader] Synchronous compilation is not supported.',
                        ),
                    });
                }
            });
        });
    });

    supportedFileExts.forEach((ext) => {
        describe(ext, () => {
            const execTest = execTestOf(ext);

            describe('patterns', () => {
                it('should work with a string', execTest('stringPattern'));
                it('should work with an array of string', execTest('arrayOfStringPatterns'));
                it('should support file globbing', execTest('fileGlobbing'));
            });

            describe('injector', () => {
                it('should work with customized function', execTest('customizedInjector'));
                it('should work with asynchronous function', execTest('asyncInjector'));
                it('should work with `prepend`', execTest('specialPrependInjector'));
                it('should work with `append`', execTest('specialAppendInjector'));
            });

            describe('resolveUrl', () => {
                it('should resolve `@import` url correctly in a variety of different situations', execTest('imports'));
                it('should not resolve `@import` url when `options.resolveUrl` is falsy', execTest('noResolveUrl'));
            });

            describe('errors', () => {
                it(
                    'should cause an error when `options.patterns` is neither a string nor an array of string',
                    execTest('invalidPatterns', (err) => {
                        expect(err).toMatchObject({
                            message: expect.stringContaining(
                                'TypeError: [style-resources-loader] '
                                + 'Expected options.patterns to be a string or an array of string. '
                                + 'Instead received undefined.',
                            ),
                        });
                    }),
                );
                it(
                    'should cause an error when `options.injector` isn\'t a function or `prepend`, `append`',
                    execTest('invalidInjector', (err) => {
                        expect(err).toMatchObject({
                            message: expect.stringContaining(
                                'TypeError: [style-resources-loader] '
                                + 'Expected options.injector to be a function or `prepend`, `append`. '
                                + 'Instead received string.',
                            ),
                        });
                    }),
                );
                it(
                    'should cause an error when `options.globOptions` isn\'t an object',
                    execTest('invalidGlobOptions', (err) => {
                        expect(err).toMatchObject({
                            message: expect.stringContaining(
                                'TypeError: [style-resources-loader] '
                                + 'Expected options.globOptions to be an object. '
                                + 'Instead received number.',
                            ),
                        });
                    }),
                );
                it(
                    'should cause an error when `options.resolveUrl` isn\'t a boolean',
                    execTest('invalidResolveUrl', (err) => {
                        expect(err).toMatchObject({
                            message: expect.stringContaining(
                                'TypeError: [style-resources-loader] '
                                + 'Expected options.resolveUrl to be a boolean. '
                                + 'Instead received function.',
                            ),
                        });
                    }),
                );
                it('should cause an error when `glob(...)` throws an error', execTest('globThrowsAnError', (err) => {
                    expect(err).toMatchObject({
                        message: expect.stringContaining('Error: EACCES: permission denied'),
                    });
                }));
                it(
                    'should cause an error when `options.injector(...)` returns neither a string nor a Buffer',
                    execTest('invalidInjectorReturn', (err) => {
                        expect(err).toMatchObject({
                            message: expect.stringContaining(
                                'TypeError: [style-resources-loader] '
                                + 'Expected options.injector(...) returns a string or a Buffer. '
                                + 'Instead received number.',
                            ),
                        });
                    }),
                );
                it(
                    'should cause an error when `options.injector(...)` throws an error',
                    execTest('injectorThrowsAnError', (err) => {
                        expect(err).toMatchObject({
                            message: expect.stringContaining('Error: This error is thrown from injector.'),
                        });
                    }),
                );
            });
        });
    });
});
