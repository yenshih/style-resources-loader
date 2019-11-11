import validate from 'schema-utils';

import {schema} from '..';

import {LOADER_NAME, VALIDATION_BASE_DATA_PATH} from '.';

export const validateOptions: <T extends {}>(options: any) => asserts options is T = options =>
    validate(schema, options, {
        name: LOADER_NAME,
        baseDataPath: VALIDATION_BASE_DATA_PATH,
    });
