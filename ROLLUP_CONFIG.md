# rollup 搭配 React并发布到NPM 遇到的问题
1. `npm install -D babel-plugin-transform-react-jsx` 让rollup可以解析JSX语法
2. 发布到npm的时候都要创建一个`index.js`文件，并导出自己的组件
```js
module.exports = require('./lib/LuckyWheel');
// 或
exports.default = require('./lib/LuckyWheel');
```
