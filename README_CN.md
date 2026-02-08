<h1 align="center">
  <br>
    <img src="https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/icon.png" alt="logo" width="200">
  <br>
  webgal for VScode
  <br>
  <br>
</h1>

<h4 align="center">WebGal Script 工具</h4>

<h5 align="center">
<img src="https://img.shields.io/github/license/xiaoxustudio/webgal-for-vscode" alt="github license"> 
<img src="https://img.shields.io/badge/language-webgal-brightgreen" alt="Language">
<img alt="VSX Downloads" src="https://img.shields.io/visual-studio-marketplace/d/Xuran1783558957.webgal-for-vscode.svg">
</h5>


- [简体中文](./README_CN.md)
- [English](./README.md)


[webgal-devtool](https://github.com/xiaoxustudio/webgal-devtool)：一款用于调试WebGal游戏的浏览器devtools扩展。

## 功能

- 语言高亮
- Hover提示
- 关键字补全
- 规范警告
- 插值变量提示|变量Hover提示、类型镶嵌、变量描述（markdown）
- 格式化
- 跳转定义（资源、变量）
- 区域折叠
- 调试功能

```txt
  ;area 开始区域标记
  ...
  ;endarea 结束区域标记
```

- 资源文件补全

```txt

  资源文件夹$资源文件
  如：tex$i 将会提示tex文件夹下文件名称包含i的文件

  资源文件夹有：
  animation、background、bgm、figure、tex、video、vocal

```

## 安装

vscode 搜索插件名称：`webgal for VSCode`

vscode市场链接：[Marketplace](https://marketplace.visualstudio.com/items?itemName=Xuran1783558957.webgal-for-vscode)

## 使用


当前工作目录**game**只要包含**config.txt**时，插件就会自动启动

或者使用启动命令自行启动插件

**可配合vs browser进行编辑**  

![vs browser](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/vs_browser.png)  

![Work](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/work.png)  

## 调试  

运行-添加配置-选择`webgal Debug`创建`launch.json`文件  

*请自行修改ws地址：地址可F12在控制台看到，端口号一般为网页url的端口号*

运行即可，可在调试控制台查看指定变量、环境配置等信息  

```txt
单个字符为变量输出
如：a，则输出变量a的值

前导$为环境配置
如：$showText，则输出环境变量showText的值 

前导#为运行配置
如：#sentence，则输出运行变量sentence的值

特殊：
@run:获取运行的所有变量名称
@env:获取环境的所有变量名称
@set 变量名 变量值             ———————— 修改变量
@script webgalScript脚本         ———————— 自定义执行脚本
```

**PS：右击有跳转到指定行选项**  

**PS：调试变量不会实时刷新，需要手动在调试控制台回车刷新，或其他操作来触发更新**

**PS：左边调试变量可修改，env和scene不可修改**

![调试](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/debug.png)

## 部分功能展示

##### Hover提示

![Hover提示](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/hover.png)

##### 关键字补全

![关键字补全](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/kw.png)

##### 规范警告  

![规范警告](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/warning.png)

##### 插值变量提示  

![插值变量提示](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/variable.png)

##### hover提示  

![插值变量提示](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/variable_hover.png)

##### 类型镶嵌  

![插值变量提示](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/variable_hint.png)

##### 跳转定义  

![插值变量提示](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/variable_jump.png)

##### 格式化

![格式化](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/format.png)

## WebGal官方链接

官方仓库：[仓库](https://github.com/OpenWebGAL/WebGAL)  

官方文档：[文档](https://docs.openwebgal.com/)

## 关于

作者：[徐然](https://github.com/xiaoxustudio)  

联系方式：[xiaoxustudio@foxmail.com](emailto://xiaoxustudio@foxmail.com)

欢迎提出您宝贵的 **issue**，我们将会处理。

## LICENSE

[You can see this](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/LICENSE)
