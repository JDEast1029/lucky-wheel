import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve'; 
import commonjs from 'rollup-plugin-commonjs';
import scss from 'rollup-plugin-scss';
import postcss from 'rollup-plugin-postcss';
// PostCSS plugins
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';

const config = {
	input: './src/main.js',
	output: {
		file: './lib/LuckyWheel.js',
		format: 'es',
		name: 'LuckyWheel'
	},
	moduleName: 'LuckyWheel',
	external: [
		'react',
		'react-dom',
		'prop-types'
	],
	plugins: [
		scss({
			output: 'lib/styles.css',
		}),
		// postcss({
		// 	sourceMap: true, // true, "inline" or false
		// 	extract : 'lib/styles.css',
		// 	plugins: [
		// 	  simplevars(),
		// 	  nested(),
		// 	  cssnext({ warnForDuplicates: false, }),
		// 	  cssnano(),
		// 	],
		// 	extensions: [ '.css' ],
		//   }),
		resolve(),
		babel({
			exclude: 'node_modules/**' // 只编译我们的源代码
		}),
		commonjs(),
	]
};

export default config;