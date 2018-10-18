# a bugly mvvm

简单实现 仿 vue 的 MVVM 系统. 已实现数据双向绑定, {{}} 绑定数据, v-show, v-html, v-model 等简单指令.

使用原生 DOM 模版进行数据绑定, 支持在改变 vm 实例 data 数据同步更新 UI.

使用非常简洁的 webpack 配置系统, 可用于完整项目.
with a clean webpack config system.

```js
// 安装依赖
npm i

// 开发环境
npm run dev
```

参考下图:
[MVVM 系统导图](https://github.com/keydone/a_bugly_mvvm/blob/master/mvvm.jpg?raw=true)
