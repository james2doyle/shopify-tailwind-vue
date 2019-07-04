/* eslint-disable no-undef */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const isDevelopment = process.env.NODE_ENV === 'development';

const alias = {
    jQuery: path.resolve('./node_modules/jquery'),
    $: path.resolve('./node_modules/jquery'),
    vue: 'vue/dist/vue.js'
};

const part = {
    resolve: {
        alias,
        extensions: ['.js', '.css', '.json', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                loader: 'url-loader',
                //include: path.join(__dirname, ''),
                options: {
                    publicPath: './',
                    limit: 10000,
                },
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};

const styleLoader = {
    loader: 'style-loader',
    options: {
        hmr: isDevelopment
    }
};

const cssLoader = {
    loader: 'css-loader',
    // Enabling sourcemaps in styles when using HMR causes style-loader to inject
    // styles using a <link> tag instead of <style> tag. This causes
    // a FOUC content, which can cause issues with JS that is reading
    // the DOM for styles (width, height, visibility) on page load.
    options: { sourceMap: !isDevelopment }
};

const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        ident: 'postcss',
        sourceMap: !isDevelopment,
        plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
        ],
    }
};

module.exports = {
    'webpack.extend': config => {
        const postCssRule = {
            test: /\.pcss$/,
            exclude: config.get('webpack.commonExcludes')
        };

        postCssRule.use = [
            ...(isDevelopment ? [styleLoader] : [MiniCssExtractPlugin.loader]),
            cssLoader,
            postcssLoader
        ];
        part.module.rules.push(postCssRule);

        return part
    },
    'webpack.postcss.plugins': (config, defaultValue) => [
      require('tailwindcss'),
      require('autoprefixer'),
      ...defaultValue
    ]
};
