const merge = require('webpack-merge')
const webpack = require('webpack')
const common = require('./common.js')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const SentryPlugin = require('@sentry/webpack-plugin')
const path = require('path')

module.exports = merge(common[0], {
	mode: 'production',
	devtool: 'source-map',
	output: {
		sourceMapFilename: 'js/../sourcemaps/[name].[chunkhash].js.map',
		filename: 'js/[name].[contenthash].js'
	},
	module: {
		rules: [
			{
				test: /\.(css|scss)$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							importLoaders: 2,
							modules: true,
							url: false,
							sourceMap: false,
							localIdentName: '[local]__[hash:base64:20]',
							minimize: {
								safe: true
							}
						}
					}, // translates CSS into CommonJS
					{
						loader: 'postcss-loader'
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: false,
							sourceMapContents: false
						}
					} // compiles Sass to CSS,
				]
			},
			{
				test: /\.css$/,
				include: /node_modules/,
				use: [MiniCssExtractPlugin.loader, 'css-loader']
			}
		]
	},
	optimization: {
		minimizer: [
			new UglifyJSPlugin({
				sourceMap: true,
				cache: true,
				parallel: true,
				uglifyOptions: {
					comments: false,
					compress: {
						warnings: false,
						drop_console: true
					}
				}
			}),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					safe: true
				}
			})
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
		new MiniCssExtractPlugin({
			filename: `css/[name].css`,
			options: {
				allChunks: true
			}
		}),
		new SentryPlugin({
			release: require('../package.json').version,
			include: './client/compiled/assets/sourcemaps',
			ignore: ['node_modules', 'webpack.config.js'],
			debug: false,
			configFile: path.resolve(__dirname, '../sentry-client.properties')
		})
	]
})