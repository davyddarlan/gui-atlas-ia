const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    plugins: [
        new HtmlWebpackPlugin({
          title: 'Atlas iA',
          template: 'index.html'
        }),
        new VueLoaderPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
    ],
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            { 
                test: /\.css$/i, 
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
               test: /\.(woff|woff2|eot|ttf|otf)$/i,
               type: 'asset/resource',
            },
            { 
                test: /\.vue$/i, 
                use: ['vue-loader']
            }
        ]
    },
    resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js',
          'jquery$': 'jquery/dist/jquery.min.js',
        }
    }
}