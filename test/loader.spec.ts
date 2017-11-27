import { execTestOf } from './helpers';

import { supportedFileExts } from '../src/utils';

describe('style-resources-loader', () => {
    // TODO: add more tests and remove `slice`
    supportedFileExts.slice(1, 2).forEach((ext) => {
        const execTest = execTestOf(ext);

        describe('patterns', () => {
            it('should work with a string', execTest('stringPattern'));
            it('should work with an array of string', execTest('arrayOfStringPatterns'));
            it('should support file globbing', execTest('fileGlobbing'));
        });

        describe('injector', () => {
            it('should work with customized function', execTest('customizedInjector'));
        });

        describe('imports', () => {
            it('should resolve imports correctly in variety situations', execTest('imports'));
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
            it('should cause an error when `options.injector` isn\'t a function', execTest('invalidInjector', (err) => {
                expect(err).toEqual(expect.stringMatching(/TypeError: \[style-resources-loader\] /));
                expect(err).toEqual(expect.stringMatching(/Expected options\.injector to be a function\. /));
                expect(err).toEqual(expect.stringMatching(/Instead received string\./));
            }));
            it(
                'should cause an error when `options.resolveUrl` isn\'t a boolean',
                execTest('invalidResolveUrl', (err) => {
                    expect(err).toEqual(expect.stringMatching(/TypeError: \[style-resources-loader\] /));
                    expect(err).toEqual(expect.stringMatching(/Expected options\.resolveUrl to be a boolean\. /));
                    expect(err).toEqual(expect.stringMatching(/Instead received function\./));
                }),
            );
            it(
                'should cause an error when `options.injector(...)` returns neither a string nor a Buffer',
                execTest('invalidInjectorReturn', (err) => {
                    expect(err).toEqual(expect.stringMatching(/TypeError: \[style-resources-loader\] /));
                    expect(err).toEqual(
                        expect.stringMatching(/Expected options\.injector\(\.\.\.\) returns a string or a Buffer\. /),
                    );
                    expect(err).toEqual(expect.stringMatching(/Instead returns number\./));
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
