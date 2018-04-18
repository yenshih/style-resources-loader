module.exports = {
    transform: {
        '.(ts|tsx)': './node_modules/ts-jest/preprocessor.js'
    },
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
    testEnvironment: 'node',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js'
    ],
    coveragePathIgnorePatterns: [
        'node_modules',
        'test',
        'src'
    ]
};
