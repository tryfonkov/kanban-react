var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');
var pkg = require('./package.json');
var clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var TARGET = process.env.npm_lifecycle_event;
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

process.env.BABEL_ENV = TARGET;

var common = {
	entry: APP_PATH,
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	output: {
		path: BUILD_PATH,
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loaders: ['babel'],
				include: APP_PATH
			}
		]
	},	
	plugins: [		
		new htmlWebpackPlugin({title: 'Kanban app'})
	]
};

if (TARGET === 'start' || !TARGET) {
	module.exports = merge(common, {
		devtool: 'eval-source-map',
		devServer: {
			historyApiFallback: true,
			hot: true,
			inline: true,
			progress: true
		},
		module: {
			loaders: [
				{
					test: /\.css$/,
					loaders: ['style', 'css'],
					include: APP_PATH
				}
			]
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin()
		]

	});
}

if (TARGET === 'build' || TARGET === 'stats') {
	module.exports = merge(common, {
		entry: {
			app: APP_PATH,
			vendor: Object.keys(pkg.dependencies)
		},
		output: {
			path: BUILD_PATH,
			filename: '[name].[chunkhash].js'
		},
		devtool: 'source-map',
		module: {
			loaders: [
				{
					test: /\.css$/,
					loader: ExtractTextPlugin.extract('style', 'css'),
					include: APP_PATH
				}
			]
		},
		plugins: [
			new clean(['build']),
			new ExtractTextPlugin('styles.[chunkhash].css'),
			new webpack.optimize.CommonsChunkPlugin(
				'vendor',
				'[name].[chunkhash].js'
			),
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': JSON.stringify('production')
				}
			}),
			new webpack.optimize.UglifyJsPlugin({
				compress: {warnings: false}
			})
		]
	});
}