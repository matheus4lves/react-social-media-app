const path = require("path");

module.exports = {
  entry: "./app/Main.js",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "app"),
    filename: "bundle.js",
  },
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    contentBase: path.join(__dirname, "app"),
    port: 3000,
    hot: true,
    host: "0.0.0.0",
    useLocalIp: true,
    open: {
      app: [
        "/opt/firefox-84.0b4/firefox/firefox",
        "-P web-development",
        "--private-window",
      ],
    },
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-react",
              ["@babel/preset-env", { targets: { node: "14" } }],
            ],
          },
        },
      },
    ],
  },
};
