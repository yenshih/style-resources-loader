# style-resources-loader

[![build status](https://img.shields.io/travis/yenshih/style-resources-loader/master.svg?style=flat-square)](https://travis-ci.org/yenshih/style-resources-loader)
[![Coverage Status](https://img.shields.io/coveralls/yenshih/style-resources-loader/master.svg?style=flat)](https://coveralls.io/github/yenshih/style-resources-loader?branch=master)
[![npm version](https://img.shields.io/npm/v/style-resources-loader.svg?style=flat-square)](https://www.npmjs.com/package/style-resources-loader)
[![npm downloads](https://img.shields.io/npm/dm/style-resources-loader.svg?style=flat-square)](https://www.npmjs.com/package/style-resources-loader)

This loader is a CSS preprocessor resources loader for webpack, which inject your resources into multiple `sass / scss / less` files.

It's mainly used to
 - share your `variables / mixins / functions` across all style files, so you don't need to `@import` them manually.
 - override `variables` in style files provided by other libraries (e.g. [ant-design](https://github.com/ant-design/ant-design)) and customize your own theme.

## Example

**Prepend** `variables` and `mixins` to all `scss` files.

``` js
{
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader', {
        loader: 'style-resources-loader',
        options: {
            resources: [
                'path/to/scss/variables/*.scss',
                'path/to/scss/mixins/*.scss'
            ]
        }
    }]
}
```

**Append** `variables` to all `less` files, override original `less variables`.

```js
{
    test: /\.less$/,
    use: ['style-loader', 'css-loader', 'less-loader', {
        loader: 'style-resources-loader',
        options: {
            resources: 'path/to/less/variables/*.less'
            injector: 'append'
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

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`resources`**|`{string \| string[]}`|`/`|Path to resources.|
|**`injector`**|`{'prepend' \| 'append' \| (source: string, resource: string) => string}`|`'prepend'`|Indicate how the loader inject resources. You can write your own injector and control the resource injection precisely.|
