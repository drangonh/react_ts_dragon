# react_ts_dragon

# 搭建流程

## 从零开始手工搭建一个新项目

- 创建项目仓库
- yarn init 生成 package.json
  创建一个 .gitignore 文件

```
# MacOS / Windows 等系统文件
.DS_Store
Thumbs.db

# Node 依赖目录
node_modules/

# 输出目录
/dist
*.tsbuildinfo

# 日志
*.log

# 运行时数据
pids
*.pid
*.pid.lock

# 集成开发环境配置文件
/.vscode

# ESLint 缓存
.eslintcache
```

- 安装 ts:
  `yarn add -D typescript && npx tsc --init`
- tsc --init 命令创建 tsconfig.json 文件,[typeScript tsconfig 配置详解](https://juejin.cn/post/6844904093568221191)
  建议设置以下选项：
  incremental 设置为 true，允许增量编译，有助于加快编译速度。
  target 设置为 ESNEXT，即直接输出为最新的 ES 标准。
  module 设置为 ESNext，即面向未来的 ESM 模块化。
  allowJS 及 checkJS 设置为 true，允许编译 JavaScript 文件。
  jsx 设置为 react-jsx，本文中我们不会使用到 Babel，因此是直接通过 TSC 将 JSX 代码片段编译为 JS 代码片段。 另外，react-jsx 是 TypeScript 在 4.1 引入的新特性，它可以让我们不需要再每一个 JSX / TSX 文件中写 import React from 'react'语句。
  outDir 设置为 ./dist/es，dist 是我们的发行（distribution）根目录，而 es 是我们默认的 ESM 模块发行目录。
  rootDir 设置为 ./src，这是我们存放源代码的目录，请顺手创建。
  strict 改为 true，即启用所有严格类型检查选项。
  moduleResolution 改为 node，将模块解析模式设为 Node.js。
  allowSyntheticDefaultImports 改为 true，这样可以让 import React from 'react' 这样的语句不会报错。当然如今 esModuleInterop 已经默认开启，也会起到隐式声明的作用。
  如果你和我一样需要用到 decorator 特性，需要将 experimentalDecorators 和 emitDecoratorMetadata 改为 true
  如果开发的是一个 NPM 包项目，declaration 需要改为 true。
  最后加上 include 和 exclude 选项，告诉编译器需要编译和忽略什么。
- 引入 Prettier,代码风格更加统一和规范,支持包括 JavaScript、TypeScript、HTML、CSS/LESS 甚至 Markdown 在内的多种文件的格式化。yarn add -D prettier&&touch .prettierrc.在 prettierrc 加入如下代码

```
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

- 引入 ESLint,ESLint 如今已经成为前端代码校验的必备工具，TypeScript 过去需要依赖 tslint 工具进行校验，而现在早已被 ESLint 及一系列的 plugin 取代。安装 ESLint 的命令如下：

```
yarn add -D eslint
yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
yarn add -D eslint-config-airbnb eslint-config-airbnb-typescript
yarn add -D eslint-plugin-import eslint-plugin-jsx-a11y
yarn add -D eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks
```

这里我们选用的是 eslint-config-airbnb 配置，它对 JSX、Hooks、TypeScript 及 A11y 无障碍化都有良好的支持，可能也是目前最流行、最严格的 ESLint 校验之一。

创建 ESLint 配置文件 .eslintrc.js：

- 引入 React 技术栈

```
yarn add react react-dom
yarn add -D @types/react @types/react-dom
```

## Webpack

Webpack 依然是 2021 年最流行的打包工具。相对于 Vite 来说它的功能更加强大，但是性能较低且配置复杂度偏高

- 引入 Webpack 构建器
  yarn add -D webpack webpack-merge webpack-cli webpack-dev-server webpackbar clean-terminal-webpack-plugin ts-loader fork-ts-checker-webpack-plugin

Webpack 的配置通常会有三份
common 通用配置：包含 Webpack 基础通用 配置信息，环境中立。
dev 开发配置：继承自 base，包含开发态的特殊配置，为开发环境。
prod 生产配置：同样继承自 base，包含线上最终态的特殊配置，为生产环境。

创建 src/webpack/webpack.common.config.js

我们通过 webpack-merge 实现继承 common 配置。
创建:webpack.dev.config.js

添加 public/index.html,public 是 webpack-dev-server 默认的静态资源目录。

修改 package.json ，添加 scripts 脚本执行

- 引入 Less 技术栈
  yarn add -D less less-loader style-loader css-loader
  yarn add classnames

修改 scripts/webpack/webpack.common.config.js 文件

```
module.exports = {
  ...
  module: {
    rules: [
      ...
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
};
```

- html-webpack-plugin,安装: yarn add -D html-webpack-plugin
  在 webpack.common.config.js 中的 plugins 配置:

```
new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../../dist/index.html'),
      template: path.resolve(__dirname, '../../src/index.html'),
      inject: 'body',
})
```

- 集成 ESLint
  修改 scripts/webpack/webpack.common.config.js

```
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

...

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
      ...
  ]
  ...
  plugins: [
    ...
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './src/**/*.{ts,tsx,js,jsx}',
      },
    }),
  ],
};
```

- 支持模块热更新
  yarn add -D @pmmmwh/react-refresh-webpack-plugin react-refresh react-refresh-typescript

scripts/webpack/webpack.dev.config.js 中的内容替换

## 管控你的 Git 提交

- 安装依赖:yarn add -D commitizen cz-conventional-changelog @commitlint/config-conventional @commitlint/cli commitlint-config-cz cz-customizable husky

Git 的原则，即 ”提交 commit 前，必须保证没有编译时异常“。
Github 上看到开源项目的 commit 消息都是以 feat、fix、chore 等开头，这其实是 commit-lint 规范：
feat：新功能（feature）变更，大多数 commit 都属于这种类型。
fix：修复缺陷（bug）变更。
docs：修改或添加文档（documentations）及代码注释变更。
style： 仅由代码格式化造成的变更。
refactor：重构（refactor）变更。
test：由测试相关的变更。
chore：构建过程、配置及辅助工具相关的变更，十分常用。

校验:yarn add -D husky lint-staged @commitlint/config-conventional @commitlint/cli

对 Git staged 状态中的源代码执行 eslint
新增:.lintstagedrc.json

校验 Git commit 消息
添加 commitlint.config.js

安装 husky，这将把 husky 挂到 Git 提供的 hooks 上
npm install -D husky
新建文件夹:.husky
npx husky add .husky/pre-commit "npx --no-install lint-staged"
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'

- 更新 package.json

```
{
  ...
  "module": "/dist/es/index.js",
  "types": "./dist/es/index.d.ts",
}
```
