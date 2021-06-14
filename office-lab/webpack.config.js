const devCerts = require("office-addin-dev-certs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const webpack = require("webpack");
const path = require("path");

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const config = {
    devtool: "source-map",
    entry: {
      polyfill: "@babel/polyfill",
      taskpane: "./src/taskpane/taskpane.ts",
      commands: "./src/commands/commands.ts"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js", "scss", "css"]
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: "babel-loader"
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: "ts-loader"
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: true,
                caseSensitive: true,
                removeComments: false,
                collapseWhitespace: false
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: "file-loader"
        },
        {
          test: /\.css$/,
          use: [
            'style-loader', // creates style nodes from JS strings
            'css-loader', // translates CSS into CommonJS
            'sass-loader', // compiles Sass to CSS, using Node Sass by default
          ],
        },
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "taskpane"]
      }),
      new CopyWebpackPlugin([
        { to: "taskpane.css", from: "./src/taskpane/taskpane.css" },
        { from: './assets', to: 'assets' },
        { from: './manifest_prod.xml', to: 'manifest.xml' },
        { from: './manifest.xml', to: 'manifest_dev.xml' },
        { from: './templates', to: 'templates' },
        { from: './cert.pem', to: 'cert.pem' },
        { from: './key.pem', to: 'key.pem' }
      ]),
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/commands/commands.html",
        chunks: ["polyfill", "commands"]
      })
    ],
    devServer: {
      headers: {
        headers: {
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
          "Access-Control-Allow-Origin": "*"
        }
      },      
      https: (options.https !== undefined) ? options.https : await devCerts.getHttpsServerOptions(),
      port: process.env.npm_package_config_dev_server_port || 3000
    }
  };

  return config;
};
