let devMode = true

module.exports = {
    mode: devMode ? "development" : "production",
    watch: devMode,
    // watchOptions: {
    //     poll: 500
    // },

    entry: "./src",

    output: {
        filename: "main.js",
        path: __dirname + "/../../static/js/views"
    },

    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                exclude: /node_modules$/
            }
        ]
    },

    devtool: devMode ? "source-map" : "none"
}
