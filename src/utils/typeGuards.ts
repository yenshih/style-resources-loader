import path from 'path';

import isPlainObject from 'is-plain-object';
import isCallable from 'is-callable';
import isPromise from 'is-promise';

import { supportedFileExtsWithDot } from '.';

export const isUndefined = (arg: any): arg is undefined => typeof arg === 'undefined';

export const isString = (arg: any): arg is string => typeof arg === 'string';

export const isBoolean = (arg: any): arg is boolean => typeof arg === 'boolean';

export const isObject = <T extends {}>(arg: any): arg is T => isPlainObject(arg);

export const isFunction = <T extends (...args: any[]) => any>(arg: any): arg is T => isCallable(arg);

export const isStyleFile = (file: string) => supportedFileExtsWithDot.includes(path.extname(file));

export { isPromise };
