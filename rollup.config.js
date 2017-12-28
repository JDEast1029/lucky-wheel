import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve'; 
import commonjs from 'rollup-plugin-commonjs';
import scss from 'rollup-plugin-scss'

const config = {
	input: './src/main.js',
	output: {
		file: './lib/LuckyWheel.js',
		format: 'es'
	},
	moduleName: 'LuckyWheel',
	external: [
		'react',
		'react-dom',
		'prop-types'
	],
	plugins: [
		scss({
			output: 'lib/css/styles.css',
		}),
		resolve(),
		babel({
			exclude: 'node_modules/**' // 只编译我们的源代码
		}),
		commonjs(),
	]
};

export default config;