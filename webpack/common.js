const path = require('path')
const webpack = require('webpack')
const copyWP = require('copy-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const source = path.resolve(__dirname, '../client/source')
const compiled = path.resolve(__dirname, '../build/client')
const server = path.resolve(__dirname, '../server/')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = [
	{
		entry: {
			bundle_home: path.resolve(source, 'components/index.tsx'),///index.js`,
			//hello: path.resolve(source, 'pages/hello/index.js')///embed.js`
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.scss', '.css', '.js', '.jsx', '.txt'],
			alias: {
				'components': path.resolve(source, 'components'),
				'decorators': path.resolve(source, 'decorators'),
				'reducers': path.resolve(source, 'redux/reducers'),
				'assets': path.resolve(source, 'assets')
			}
		},
		output: {
			path: path.resolve(compiled, 'assets'),
			filename: 'js/[name].js',
			publicPath: '/assets/'
		},
		module: {
			rules: [
				{
					test: /\.txt$/i,
					use: 'raw-loader',
				},
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					loader: 'awesome-typescript-loader',
					options: {
						configFileName: "tsconfig.client.json"
					},
				},
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: ['babel-loader']
				},
				{
					test: /\.(png|jpg|jpeg|svg)$/,
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: 'images/[hash]-[name].[ext]'
					}
				}
			]
		},
		plugins: [
			new copyWP([
				{ from: path.resolve(source, 'assets/images'), to: path.resolve(compiled, 'assets/images') },
				{ from: path.resolve(source, 'assets/fonts'), to: path.resolve(compiled, 'assets/fonts') }
			]),
			new HtmlWebpackPlugin({
				title: 'codedamn',
				sentryReleaseVersion: require('../package.json').version,
				filename: path.resolve(__dirname, '../build/index.prod.html'),
				template: './client/source/index.html',
				minify: {
					removeComments: true,
					html5: true,
					collapseWhitespace: true
				},
				showErrors: true,
				alwaysWriteToDisk: true
			}),
			new HtmlWebpackHarddiskPlugin(),
			new webpack.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
			new MonacoWebpackPlugin()
		],
		optimization: {
			runtimeChunk: 'single',
			splitChunks: {
				chunks: 'all',
				maxInitialRequests: Infinity,
				minSize: 0,
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name(module) {
							// get the name. E.g. node_modules/packageName/not/this/part.js
							// or node_modules/packageName
							const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

							// npm package names are URL-safe, but some servers don't like @ symbols
							return `npm.${packageName.replace('@', '')}`;
						},
					},
				},
			},
		},
	},
	// server now
	{
		entry: {
			server: path.resolve(server, 'index.ts')
		},
		externals: [nodeExternals()],
		devtool: 'source-map',
		target: 'node',
		resolve: {
			alias: {
				'controllers': path.resolve(server, 'controllers'),
				'interfaces': path.resolve(server, 'interfaces'),
				'middlewares': path.resolve(server, 'middlewares'),
				'models': path.resolve(server, 'models'),
				'root': server,
				'sdecorators': path.resolve(server, 'decorators'),
			},
			extensions: ['.tsx', '.ts', '.js']
		},
		output: {
			path: path.resolve(__dirname, '../'),
			filename: './build/server/server.js',
			libraryTarget: 'commonjs',
			publicPath: path.resolve(__dirname, '../')
		},
		node: {
			__dirname: true
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: "awesome-typescript-loader",
					options: {
						configFileName: "tsconfig.server.json"
					},
					exclude: /node_modules/,
				}
			]
		}
	}
]