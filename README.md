
<h1 align="center">ibo front base</h1>

## 简介
该项目来自业内流行的基于React的集大成框架Ant design pro。公司采用2.1.1版本作为基线版本，后续开发项目，请以当前项目为模板，新建自己的前端项目，禁止在该项目上直接开发业务。


## 使用方式
在使用该项目之前，请先对整个项目有所了解，请先看[项目说明文档](https://www.yuque.com/simonalong/jishu/war7do)

## 一、前端创建
### 1.前端项目设立
新建自己的前端项目，将当前项目上传上去（或者拷贝上去均可）

### 2.项目安装相关依赖
请在自己新建的前端项目中安装
> cd xxxx <br/>
> npm install <br/>

## 二、前端配置
前端配置这里分为两步：1.配置后端部分，2.添加前端业务
### 1.配置后端部分
这里要配置后端host和port。
在文件config.js中添加自己的后端host
```javascript
  proxy: {
    // 这里是api文件的前缀
    '/sequence/': {
      // 后端路径
      target: 'http://localhost:8080/',
      changeOrigin: true,
      // 将api文件的前缀进行替换
      pathRewrite: { '^/sequence': '' },
    },
  }
```
其中如何配置后端，请看下面的"项目说明文档"，先对该项目的整体有个了解

### 2.添加前端业务
添加前端业务这里可以采用"front-springboot-generator"可以直接生成前端后端项目。具体的可以看该项目自己的readme.md介绍。

## 三、后端配置
后端这里可以看项目"front-springboot-generator"的文档介绍和说明

## 四、启动
当前后端都配置完成后，启动后端后，启动前端
> npm run start

即可实现增删改查的功能

## 五、说明文档
其中对于该项目中的文档相关的介绍如下：<br/>
[项目说明文档](https://www.yuque.com/simonalong/jishu/war7do) （目前说明文档还是在公网中，后续迁移到公司文档库）<br/>
[官方文档](https://pro.ant.design/)<br/>
[官方组件文档](https://ant.design/components/button-cn/)<br/>




