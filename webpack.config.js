const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: './src/index.js',
    output: {
      filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 3000,
      hot: true,
      open: true,
      historyApiFallback: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[hash][ext][query]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[hash][ext][query]'
          }
        },
        {
          test: /\.(glb|gltf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'models/[hash][ext][query]'
          }
        },
        {
          test: /\.(mp3|wav|ogg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'audio/[hash][ext][query]'
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: 'Gustave - 3D Interactive Resume',
        minify: !isDevelopment
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            to: '',
            noErrorOnMissing: true
          }
        ]
      })
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10
          },
          three: {
            test: /[\\/]node_modules[\\/]three[\\/]/,
            name: 'three',
            priority: 20
          }
        }
      }
    },
    performance: {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  };
};
