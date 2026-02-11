<h1 align="center">
<br>
<img src="https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/icon.png" alt="logo" width="200">
<br>
webgal for VScode
<br>
<br>
</h1>

<h4 align="center">WebGal Script Tool</h4> 

<h5 align="center">
<img src="https://img.shields.io/github/license/xiaoxustudio/webgal-for-vscode" alt="github license"> 
<img src="https://img.shields.io/badge/language-webgal-brightgreen" alt="Language">
<img alt="VSX Downloads" src="https://img.shields.io/visual-studio-marketplace/d/Xuran1783558957.webgal-for-vscode.svg">
</h5>

> [!IMPORTANT]
> 
> The project has been migrated to [webgal-language-tools](https://github.com/xiaoxustudio/webgal-language-tools).
> 
> This warehouse is no longer under maintenance

- [简体中文](./README_CN.md)
- [English](./README.md)



[webgal-devtool](https://github.com/xiaoxustudio/webgal-devtool): A browser devtools extension designed for debugging WebGal games. 
# Function 
- Language highlighting
- Hover tooltip
- Keyword completion
- Compliance warning
- Interpolation variable prompt | Variable Hover prompt, type embedding, variable description (markdown)
- Formatting
- Jump to definition (resource, variable)
- Area collapse
- Debugging function 
```txt
; area - Start area marker 
...
; endarea - Mark for indicating the end of an area 
```

Resource file completion 
```txt

Resource folder $Resource file
For example: tex$i will prompt for files in the tex folder whose names contain the letter "i". 
The resource folder contains:
animation, background, bgm, figure, tex, video, vocal 
```

## Installation

search plugin name in VSCode: `webgal for VSCode`

VSCode MarketLink: [Marketplace](https://marketplace.visualstudio.com/items?itemName=Xuran1783558957.webgal-for-vscode)

## Usage 
When the current working directory is **game** and it contains **config.txt**, the plugin will automatically start. 

Or you can start the plugin by using the startup command yourself. 
Can be edited in conjunction with the vs browser 

![vs browser](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/vs_browser.png)

![Work](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/work.png)

## Debugging 
Run - Add Configuration - Select `webgal Debug` to create the `launch.json` file 

Please modify the ws address yourself: The address can be seen in the console by pressing F12. The port number is usually the same as that of the web page URL. 

Just run it. You can view the specified variables, environment configurations, etc. in the debug console. 
```txt
Output a single character as a variable
For example: a, then output the value of the variable a 
The prefix $ is used for environment configuration.
For example: $showText will output the value of the environment variable showText. 
The prefix "#" is for configuration during operation.
For example: #sentence, then the value of the running variable "sentence" will be output. 
Special:
@run: Retrieves all variable names in the running environment
@env: Retrieves all variable names in the environment
@set variable_name variable_value  —————— Modify the variable
@script webgalScript script         —————— Customize the execution script 
```

**Note: Right-clicking offers the option to jump to the specified line.** 

**Note: The debug variables will not be updated in real time. You need to manually press the Enter key in the debug console or perform other operations to trigger the update.** 

**Note: The variables on the left can be modified, while env and scene cannot be changed.** 

![Debugging](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/debug.png) 

## Partial Function Display 
##### Hover Tip 
![Hover Tooltip](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/hover.png) 

##### Keyword Completion 
![Keyword Completion](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/kw.png)

##### Regulatory Warning 
![Standard Warning](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/warning.png)

##### Interpolation Variable Prompt 
![Interpolation Variable Prompt](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/variable.png) 

##### Hover Tip 
![Interpolation Variable Hint](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/variable_hover.png)

##### Type Mosaic
![Interpolation Variable Hint](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/variable_hint.png) 

##### Jumping Definition 
![Interpolation Variable Hint](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/variable_jump.png) 

##### Formatting 
![Format](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/resources/test/format.png) 

## Official Link of WebGal 

Official Repository: [Repository](https://github.com/OpenWebGAL/WebGAL) 

Official documentation: [Document](https://docs.openwebgal.com/) 

## Regarding 

Author: [Xu Ran](https://github.com/xiaoxustudio) 

Contact Information: [xiaoxustudio@foxmail.com](mailto:xiaoxustudio@foxmail.com) 

Please feel free to raise your valuable **issue**. We will handle it. 

## LICENSE

[You can see this](https://raw.githubusercontent.com/xiaoxustudio/webgal-for-vscode/master/LICENSE)
