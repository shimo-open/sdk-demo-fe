# 石墨 SDK 前端 demo

## 项目介绍
本项目是石墨 SDK 前端 demo，用于演示前端对接石墨 SDK 的方法。

## 项目文件

### /shimo-js-sdk-1.2.1
该文件夹是石墨前端 js-sdk 编译后的文件，使用时引入即可。

#### 其他引入方式：
通过 npm
```shell
npm install --save shimo-js-sdk
```

通过 yarn
```shell
yarn add shimo-js-sdk
```

### index.html
该文件是 demo 的入口文件，其中引入了石墨前端 js-sdk，以及示例的 index.js 文件。

该文件包含一个 id 为 "iframe-container" 的 div，用于作为父容器放置石墨的 iframe。

### index.js
该文件演示了如何用 js 代码初始化石墨前端 js-sdk，其中 signature, token, endpointUrl, fileId 这四个变量需要接入方填写。

## 使用前
使用前确保：
1. id 为 fileId 的文件已被创建（新建或导入）。
2. 后端已提供以下两个回调接口：
    - 获取文件元信息-协同文档 /files/{fileId}
    - 获取当前用户信息 /users/current/info

## 使用方法
1. 填写 index.js 文件中的 signature, token, endpointUrl, fileId 四个变量。
2. 用浏览器（建议 Chrome）打开 index.html 文件，预期可以在网页中看到石墨文档的编辑器。

## 备注
由于鉴权参数 signature 和 token 应存在过期时间，故强烈建议接入方在后端计算 signature 和 token，并提供接口供前端调用，以动态获取 signature 和 token。

