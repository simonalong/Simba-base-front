
<h1 align="center">ibo front base</h1>

## 简介
该项目来自业内流行的基于React的集大成框架Ant design pro。公司采用2.1.1版本作为基线版本，后续开发项目，请以当前项目为模板，新建自己的前端项目，禁止在该项目上直接开发业务。

## 使用方式
在使用该项目之前，请先对整个项目有所了解，请先看[项目说明文档](https://www.yuque.com/simonalong/jishu/war7do)

## 一、前端创建
#### 1.创建自己的前端
去 gitlab http://10.30.30.3 创建一个空项目

#### 2.进入ibo-front-base项目
> cd ibo-front-base

#### 3.切换到master分支
> git checkout master

#### 4.添加模板项目与自己业务前端项目关联（其中xxx可以为自己的业务名，对应的git为自己创建的git）
> git remote add origin-xxx ssh://xxxx/xxx.git

#### 5.推送
> git push -u origin-business master

#### 6.删除模板的这个远端（将自己的远端再删除掉）
> git remote remove origin-xxx


### 2.配置业务
#### 1.拉取自己的界面新业务
> git clone ssh://xxxx/xxx.git xxx <br/>
> cd xxx<br/>

安装前端的依赖
> npm install <br/>

注意：
这里安装有点慢，可以采用 npm install -g 这个试试

至此前端已经安装完毕
## 二、前端配置
到这里其实就可以去看项目"ibo-robot"中的说明了。在执行前后端生成之后，就可以启动了，先将后端启动，然后启动前端

## 三、启动前端
当前后端都配置完成后，启动后端后，启动前端
> npm run start

即可实现增删改查的功能

## 五、说明文档
其中对于该项目中的文档相关的介绍如下：<br/>
[项目说明文档](https://www.yuque.com/simonalong/jishu/war7do) （目前说明文档还是在公网中，后续迁移到公司文档库）<br/>
[官方文档](https://pro.ant.design/)<br/>
[官方组件文档](https://ant.design/components/button-cn/)<br/>




