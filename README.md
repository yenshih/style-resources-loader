# style-resources-loader

[![build status](https://img.shields.io/travis/yenshih/style-resources-loader/master.svg?style=flat-square)](https://travis-ci.org/yenshih/style-resources-loader)
[![Coverage Status](https://img.shields.io/coveralls/yenshih/style-resources-loader/master.svg?style=flat)](https://coveralls.io/github/yenshih/style-resources-loader?branch=master)
[![npm version](https://img.shields.io/npm/v/style-resources-loader.svg?style=flat-square)](https://www.npmjs.com/package/style-resources-loader)
[![npm downloads](https://img.shields.io/npm/dm/style-resources-loader.svg?style=flat-square)](https://www.npmjs.com/package/style-resources-loader)

This loader is a CSS preprocessor resources loader for webpack, which injects your style resources (e.g. `variables / mixins`) into multiple `sass / scss / less` files.

It's mainly used to
 - share your `variables / mixins / functions` across all style files, so you don't need to `@import` them manually.
 - override `variables` in style files provided by other libraries (e.g. [ant-design](https://github.com/ant-design/ant-design)) and customize your own theme.

## Example

Prepend `variables` and `mixins` to all `scss` files with default resources injector.

``` js
{
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader', {
        loader: 'style-resources-loader',
        options: {
            patterns: [
                'path/to/scss/variables/*.scss',
                'path/to/scss/mixins/*.scss'
            ]
        }
    }]
}
```

Append `variables` to all `less` files and override original `less variables`.

```js
{
    test: /\.less$/,
    use: ['style-loader', 'css-loader', 'less-loader', {
        loader: 'style-resources-loader',
        options: {
            patterns: 'path/to/less/variables/*.less',
            injector: (source, resources) => source + resources.map(({ content }) => content).join('')
        }
    }]
}
```

Append `mixins` and prepend `variables` to all `scss` files with customized resources injector.

``` js
{
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader', {
        loader: 'style-resources-loader',
        options: {
            patterns: [
                'path/to/scss/variables/*.scss',
                'path/to/scss/mixins/*.scss'
            ],
            injector: (source, resources) => {
                const combineAll = (type) => resources
                    .filter(({ file }) => file.includes(type))
                    .map(({ content }) => content)
                    .join('');
                return combineAll('mixins') + source + combineAll('variables');
            }
        }
    }]
}
```

## Installation

```
npm i style-resources-loader -D
```

## Documentation

### Loader Options

#### patterns

A string or an array of string, represents the path to the resources you would like to inject.

It supports globbing. You could include many files using a file mask.

For example, `path.resolve(__dirname, './styles/*/*.less')` would include all `less` files from `variables` and `mixins` directories and ignore `reset.less` in such following structure.

```
./styles
  /variables
    |-- fonts.less
    |-- colors.less
  /mixins
    |-- size.less
  |-- reset.less
```

#### injector

An optional function which controls the resources injection precisely.

It receives two parameters:

- **source**

    A string containing the content of the source file.

- **resources**

    An array of resource, each contains `file` and `content` property:

    - **file**: A string represents the absolute path to the resource.

    - **content**: A string containing the content of the resource file.

It defaults to `(source, resources) => resources.map(({ content }) => content).join('') + source`, which means the loader prepends all resources to source file.
