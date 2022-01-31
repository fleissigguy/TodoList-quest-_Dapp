const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
    mode: 'development',
    devServer :{
        static:{directory: path.join(__dirname, 'app')},
        compress : true,
        port:8080
    },
    entry:'./src/index.js',
    output: {
        filename:'bundle.js',
        path:path.resolve(__dirname, 'app')
    },
    plugins: [
		new NodePolyfillPlugin(),
	]


};