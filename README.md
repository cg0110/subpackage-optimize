# subpackage-optimize

#### 介绍
小程序主包体积优化终极解决方案，可将 uni-app 导出的小程序一级目录下的文件打入分包，从而减小主包体积。

#### 安装教程

npm i subpackage-optimize

#### 使用说明

1.  本项目是一个 Webpack plugin，按照官方引入即可
2.  可传一个参数，类型是数组，传入导出文件的一级目录即可
3.  特别注意 如果被打入分包的组件中有 slot 插槽，请将该组件从分包中剔除，否则可能会导致样式错乱，比如弹窗组件就不建议打入分包中

#### 示例

此示例为 webpack.config.js 内容

```
// 第一步 引入插件
const SubpackageOptimize = require('subpackage-optimize')
module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist/dev/'),
    filename: 'index.js'
  },
  module: {

  },
  plugins: [
    // 第二步 使用 将一级目录传入后
    // SubpackageOptimize 构造函数有两个参数
    // 第一个参数是打入分包的一级目录数组
    // 第二个参数是不打入分包的一级目录下的目录数组
    new SubpackageOptimize(['components'],['components/subpackageName'])
  ],
}
```





