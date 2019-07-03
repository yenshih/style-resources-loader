module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'test/tsconfig.json',
        },
    },
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    coveragePathIgnorePatterns: ['node_modules', 'test', 'lib'],
    preset: 'ts-jest',
    testMatch: null,
};
