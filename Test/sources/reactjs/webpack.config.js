


const HtmlWebPackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');
//const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');


var path = require('path');

module.exports = {
  devtool: 'source-map',
  mode: 'production',
  entry: path.resolve(__dirname,'src/index.js'),
  context: __dirname,
  output: {
    path: path.resolve( __dirname, 'dist' ),
    filename: 'bundle.js',
    publicPath:'/'
  },
  devServer: {
    contentBase: './',
    host: "localhost",
    port: 4200,
    compress: true,
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  resolve: {
    /* ... */
    modules: ['src', 'node_modules'],
    extensions: [".jsx", ".js", "*", ".es6", ".react.js", ".json", ".png", ".jpg", ".svg", ".jpeg", ".gif", ".xlxs"],
    alias: 
    {
      '@material-ui/core': '@material-ui/core/es',
      'react': path.resolve(__dirname, 'node_modules/react/cjs/react.development.js'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom/cjs/react-dom.development.js'),
      '@date-io/date-fns': path.resolve(__dirname, 'node_modules/@date-io/date-fns/'),
      '@hapi/joi': path.resolve(__dirname, 'node_modules/@hapi/joi/'),
      // '@material-ui/icons': path.resolve(__dirname, 'node_modules/@material-ui/icons/'),
      '@material-ui/pickers': path.resolve(__dirname, 'node_modules/@material-ui/pickers/'),
      'antd': path.resolve(__dirname, 'node_modules/antd/'),
      'axios': path.resolve(__dirname, 'node_modules/axios/'),
      '@tinymce/tinymce-react': path.resolve(__dirname, 'node_modules/@tinymce/tinymce-react/'),
      '@react-pdf/renderer': path.resolve(__dirname, 'node_modules/@react-pdf/renderer/'),
      'lodash': path.resolve(__dirname, 'node_modules/lodash/'),
      'react-icons': path.resolve(__dirname, 'node_modules/react-icons/'),

      variables: path.resolve(__dirname,"src/variables/Constants/index.js"),
      assets: path.resolve(__dirname,"src/assets/"),
      components: path.resolve(__dirname,"src/components/"),
      routes: path.resolve(__dirname,"src/routes.js"),
      layouts: path.resolve(__dirname,"src/layouts/"),
      views: path.resolve(__dirname,"src/views/"),
      lib: path.resolve(__dirname,"src/lib/"),
      store: path.resolve(__dirname,"src/store/"),
      services: path.resolve(__dirname,"src/services/"),
      ExportExcel: path.resolve(__dirname,"src/ExportExcel/"),
      MyFunction: path.resolve(__dirname,"src/MyFunction/"),
      locales: path.resolve(__dirname,"src/locales/"),
    }
  },
  node: { 
    fs: 'empty',
    module: "empty"
  },
  module: {
    rules: [
      {
        test: require.resolve('tinymce/tinymce'),
        loaders: [
          'imports-loader?this=>window',
          'exports-loader?window.tinymce'
        ]
      },
      {
        test: /tinymce\/(themes|plugins)\//,
        loaders: [
          'imports-loader?this=>window'
        ]
      },   
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
        include: path.resolve(__dirname,'src')
        
      },
      {
        test: /(\.css|\.scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg|ttf|woff2|woff|eot|xlsx|ico|rgba|rgb)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
              loader: 'file-loader',
              options: {
                  name: '[name].[ext]'
              }
          }
      ],

      },
    { test: /\.html$/i, use: 'html-loader' },

    ],
    noParse: [
      /es6-shim/,
      /reflect-metadata/,
      /zone\.js(\/|\\)dist(\/|\\)zone/
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve( __dirname, 'public/index.html' ),
      filename: "index.html",
      inject: "body"
    }),
    new WorkboxPlugin.GenerateSW({
      skipWaiting: true,
      clientsClaim: true
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        }
      }
    },
  },
    
};

