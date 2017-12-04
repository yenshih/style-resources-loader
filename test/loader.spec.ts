import { execTestOf } from './helpers';

import { supportedFileExts } from '../src/utils';

describe('style-resources-loader', () => {
    describe('enviroments', () => {
        describe('errors', () => {
            it('should cause an error in synchronous loader environments', () => {
                const styleResourcesLoader = require('../lib').default;

                const loaderContextMock = {
                    async: Function.prototype,
                    cacheable: Function.prototype,
                    dependency: Function.prototype,
                };

                Object.defineProperty(loaderContextMock, 'options', {
                    get() {
                        throw new Error('webpack options are not allowed to be accessed anymore.');
                    },
                });

                try {
                    styleResourcesLoader.call(Object.create(loaderContextMock));
                } catch (err) {
                    expect(err).toEqual(
                        expect.stringMatching(
                            /Error: \[style-resources-loader\] Synchronous compilation is not supported\./,
                        ),
                    );
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
            });

            describe('resolveUrl', () => {
                it('should resolve `@import` url correctly in a variety of different situations', execTest('imports'));
                it('should not resolve `@import` url when `options.resolveUrl` is falsy', execTest('noResolveUrl'));
            });

            describe('errors', () => {
                it(
                    'should cause an error when `options.patterns` is neither a string nor an array of string',
                    execTest('invalidPatterns', (err) => {
                        expect(err).toEqual(expect.stringMatching(/TypeError: \[style-resources-loader\] /));
                        expect(err).toEqual(
                            expect.stringMatching(/Expected options\.patterns to be a string or an array of string\. /),
                        );
                        expect(err).toEqual(expect.stringMatching(/Instead received undefined\./));
                    }),
                );
                it(
                    'should cause an error when `options.injector` isn\'t a function',
                    execTest('invalidInjector', (err) => {
                        expect(err).toEqual(expect.stringMatching(/TypeError: \[style-resources-loader\] /));
                        expect(err).toEqual(expect.stringMatching(/Expected options\.injector to be a function\. /));
                        expect(err).toEqual(expect.stringMatching(/Instead received string\./));
                    }),
                );
                it(
                    'should cause an error when `options.globOptions` isn\'t an object',
                    execTest('invalidGlobOptions', (err) => {
                        expect(err).toEqual(expect.stringMatching(/TypeError: \[style-resources-loader\] /));
                        expect(err).toEqual(expect.stringMatching(/Expected options\.globOptions to be an object\. /));
                        expect(err).toEqual(expect.stringMatching(/Instead received number\./));
                    }),
                );
                it(
                    'should cause an error when `options.resolveUrl` isn\'t a boolean',
                    execTest('invalidResolveUrl', (err) => {
                        expect(err).toEqual(expect.stringMatching(/TypeError: \[style-resources-loader\] /));
                        expect(err).toEqual(expect.stringMatching(/Expected options\.resolveUrl to be a boolean\. /));
                        expect(err).toEqual(expect.stringMatching(/Instead received function\./));
                    }),
                );
                it('should cause an error when `glob(...)` throws an error', execTest('globThrowsAnError', (err) => {
                    expect(err).toEqual(expect.stringMatching(/Error: EACCES: permission denied/));
                }));
                it(
                    'should cause an error when `options.injector(...)` returns neither a string nor a Buffer',
                    execTest('invalidInjectorReturn', (err) => {
                        expect(err).toEqual(expect.stringMatching(/TypeError: \[style-resources-loader\] /));
                        expect(err).toEqual(
                            expect.stringMatching(
                                /Expected options\.injector\(\.\.\.\) returns a string or a Buffer\. /,
                            ),
                        );
                        expect(err).toEqual(expect.stringMatching(/Instead received number\./));
                    }),
                );
                it(
                    'should cause an error when `options.injector(...)` throws an error',
                    execTest('injectorThrowsAnError', (err) => {
                        expect(err).toEqual(expect.stringMatching(/Error: This error is thrown from injector\./));
                    }),
                );
            });
        });
    });
});
