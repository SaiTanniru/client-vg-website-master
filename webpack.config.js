const webpack = require('webpack')
const path = require('path')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const client = {
	stats: { children: false },
	entry: {
		app: ['babel-polyfill', './src/app.js'],
	},
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname,'build'),
		filename: '[name].[contenthash].js',
		publicPath: '/dist/',
	},
	resolve: {
		extensions: ['.js','.json','.css','.scss'],
		alias: {
			'react': 'preact',
			'react-dom': 'preact'
		},
		mainFields: ['browser', 'main'],
	},
	target: 'web',
	mode: 'development',
	module: {
		rules: [
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader'
            },
			{ test: /\.svg$/, use: 'svg-inline-loader' },
			{ test: /\.scss$/, use: [
				'style-loader',
				'raw-loader',
				'postcss-loader',
				'sass-loader',
			]
			},
			{ test: /\.css$/, use: [
				'style-loader',
				'raw-loader',
			]
			},
			{ test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
		]
	},
	plugins: [
		new WebpackManifestPlugin(),
//		new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')}),
	],
	optimization: {
		moduleIds: 'hashed',
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			},
		},
	},
};

if (process.env.NODE_ENV === 'production') {
	client.plugins.push(new webpack.ProvidePlugin({Promise: 'es6-promise'}))

	client.plugins.push(
		new CompressionPlugin({
			algorithm: 'gzip',
			filename: '[path][base].gz',
			test: /\.(js|css|html|svg)$/,
			compressionOptions: { level: 9 },
		})
	)

	client.plugins.push(
		new CompressionPlugin({
			algorithm: 'brotliCompress',
			filename: '[path][base].br',
			test: /\.(js|css|html|svg)$/,
			compressionOptions: { level: 11 },
		})
	)
}

module.exports = [
	client,
];