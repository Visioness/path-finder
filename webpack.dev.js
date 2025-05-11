const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/i,
        type: "asset/resource",
        generator: {
          filename: "styles/images/[name][ext]",
        },
      },
    ],
  },
  devServer: {
    hot: true,
    devMiddleware: {
      writeToDisk: false,
    },
  },
});
