const LOADER_NAME = 'style-resources-loader';

export const throwError = (message: string) => {
    throw new Error(`[${LOADER_NAME}] ${message}`);
};

export const throwValidationError = <T>(expectedDescription: string, actualValue: T) =>
    throwError(`Expected ${expectedDescription}. Instead received ${actualValue}.`);

/* istanbul ignore next: not possible to test */
export const throwImpossibleError = () =>
    throwError(
        'This error is caused by a bug. ' +
            'Please file an issue: https://github.com/yenshih/style-resources-loader/issues.',
    );
