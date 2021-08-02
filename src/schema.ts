import type {validate} from 'schema-utils';

type Schema = Parameters<typeof validate>[0];

export const schema: Schema = {
    type: 'object',
    properties: {
        patterns: {
            anyOf: [
                {type: 'string'},
                {
                    type: 'array',
                    uniqueItems: true,
                    items: {
                        type: 'string',
                    },
                },
            ],
        },
        injector: {
            anyOf: [
                {
                    type: 'string',
                    enum: ['prepend', 'append'],
                },
                {
                    instanceof: 'Function',
                },
                {
                    type: 'object',
                },
            ],
        },
        globOptions: {
            type: 'object',
        },
        resolveUrl: {
            type: 'boolean',
        },
    },
    required: ['patterns'],
    additionalProperties: false,
};
