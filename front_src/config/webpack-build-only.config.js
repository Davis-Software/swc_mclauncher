module.exports = {
    mode:"production",

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
    }
}
