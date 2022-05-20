export const injectVariable = (code: string, key: string, value: string) =>
    code.replace(new RegExp(`\\$${key}`, 'gu'), value);
