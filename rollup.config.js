import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve'; 
import commonjs from 'rollup-plugin-commonjs';

const config = {
	input: './src/main.js',
	output: {
		file: './lib/LuckyWheel.js',
		format: 'es'
	},
	moduleName: 'LuckyWheel',
	external: [
		'react',
		'react-dom'
	],
	plugins: [
		resolve(),
		babel({
			exclude: 'node_modules/**' // 只编译我们的源代码
		}),
		commonjs(),
	]
};

export default config;