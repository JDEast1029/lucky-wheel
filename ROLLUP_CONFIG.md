# rollup 搭配 React并发布到NPM 遇到的问题
1. `npm install -D babel-plugin-transform-react-jsx` 让rollup可以解析JSX语法
2. 发布到npm的时候为了方便引入，要创建一个`index.js`文件，并导出自己的组件
```js
module.exports = require('./lib/LuckyWheel');
// 或
exports.default = require('./lib/LuckyWheel');
```
3. 加入react转码规则
```js
npm install -D babel-preset-react
```
4. ES7不同阶段语法提案的转码规则（共有4个阶段），选装一个
```js
$ npm install -D babel-preset-stage-0
$ npm install -D babel-preset-stage-1
$ npm install -D babel-preset-stage-2
$ npm install -D babel-preset-stage-3
```
