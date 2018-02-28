[![npm][npm]][npm-url]
[![node][node]][node-url]
[![downloads][downloads]][downloads-url]
[![build][build]][build-url]
[![coverage][coverage]][coverage-url]

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img
        width="200"
        height="200"
        src="https://webpack.js.org/assets/icon-square-big.svg"
    >
  </a>
  <h1>Style Resources Loader</h1>
  <p>CSS preprocessor resources loader for webpack.</p>
</div>


<h2 align="center">Install</h2>

```bash
npm i style-resources-loader -D
```

<h2 align="center">Usage</h2>

This loader is a CSS preprocessor resources loader for webpack, which injects your style resources (e.g. `variables / mixins`) into multiple imported `sass / scss / less / stylus` modules.

It's mainly used to
 - share your `variables / mixins / functions` across all style files, so you don't need to `@import` them manually.
 - override `variables` in style files provided by other libraries (e.g. [ant-design](https://github.com/ant-design/ant-design)) and customize your own theme.

<h2 align="center">Examples</h2>

Prepends `variables` and `mixins` to all `scss` files with default resources injector.

**webpack.config.js**
``` js
module.exports = {
    // ...
    module: {
        rules: [{
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader', {
                loader: 'style-resources-loader',
                options: {
                    patterns: [
                        path.resolve(__dirname, 'path/to/scss/variables/*.scss'),
                        path.resolve(__dirname, 'path/to/scss/mixins/*.scss'),
                    ]
                }
            }]
        }]
    }
}
```

Appends `variables` to all `less` files and override original `less variables`.

**webpack.config.js**
```js
module.exports = {
    // ...
    module: {
        rules: [{
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader', {
                loader: 'style-resources-loader',
                options: {
                    patterns: path.resolve(__dirname, 'path/to/less/variables/*.less'),
                    injector: 'append'
                }
            }]
        }]
    }
}
```

Appends `mixins` and prepends `variables` to all `stylus` files with customized resources injector.

**webpack.config.js**
``` js
module.exports = {
    // ...
    module: {
        rules: [{
            test: /\.styl$/,
            use: ['style-loader', 'css-loader', 'stylus-loader', {
                loader: 'style-resources-loader',
                options: {
                    patterns: [
                        path.resolve(__dirname, 'path/to/stylus/variables/*.styl'),
                        path.resolve(__dirname, 'path/to/stylus/mixins/*.styl')
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
        }]
    }
}
```

<h2 align="center">Options</h2>

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`patterns`](#patterns)**|`{String \| String[]}`|`/`|Path to the resources you would like to inject|
|**[`injector`](#injector)**|`{Function \| 'prepend' \| 'append'}`|`prepend`|Controls the resources injection precisely|
|**[`globOptions`](#globoptions)**|`{Object}`|`{}`|An options that can be passed to `glob(...)`|
|**[`resolveUrl`](#resolveurl)**|`{Boolean}`|`true`|Enable/Disable `@import` url to be resolved|

### `patterns`

A string or an array of string, represents the path to the resources you would like to inject.

It supports [globbing](https://github.com/isaacs/node-glob). You could include many files using a file mask.

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

### `injector`

An optional function which controls the resources injection precisely. It also supports `prepend` and `append` for convenience.

It defaults to `prepend` (equivalent to `(source, resources) => resources.map(({ content }) => content).join('') + source` internally), which means the loader prepends all resources to source file.

An injector function receives two parameters:

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`source`**|`{String}`|`/`|Content of the source file|
|**[`resources`](#resources)**|`{Object[]}`|`/`|Resource descriptors|

#### `resources`

An array of resource, each contains `file` and `content` property:

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`file`**|`{String}`|`/`|Absolute path to the resource|
|**`content`**|`{String}`|`/`|Content of the resource file|

### `globOptions`

An options that can be passed to `glob(...)`. See [node-glob options](https://github.com/isaacs/node-glob#options) for more details.

### `resolveUrl`

A boolean which defaults to `true`. It represents whether the relative path in `@import` or `@require` statements should be resolved.

If you were to use `@import` or `@require` statements in style resource file, you should make sure that the url is relative to that resource file, rather than the source file.

You could disable this feature by setting `resolveUrl` to `false`.

<h2 align="center">License</h2>

[MIT](http://www.opensource.org/licenses/mit-license.php)

[npm]: https://img.shields.io/npm/v/style-resources-loader.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/style-resources-loader
[node]: https://img.shields.io/node/v/style-resources-loader.svg
[node-url]: https://nodejs.org
[downloads]: https://img.shields.io/npm/dm/style-resources-loader.svg?style=flat-square
[downloads-url]: https://www.npmjs.com/package/style-resources-loader
[build]: https://img.shields.io/travis/yenshih/style-resources-loader/master.svg?style=flat-square
[build-url]: https://travis-ci.org/yenshih/style-resources-loader
[coverage]: https://img.shields.io/coveralls/yenshih/style-resources-loader/master.svg?style=flat
[coverage-url]: https://coveralls.io/github/yenshih/style-resources-loader?branch=master
