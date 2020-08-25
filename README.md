# YobotWebInterface 

本项目使用[Quasar](https://quasar.dev/)对yobot的web管理界面进行调整，提供对PC和移动端更好的布局适配以及更友好的交互逻辑。

<details>
<summary>目录</summary>

- [YobotWebInterface](#yobotwebinterface)
    - [最近更新](#最近更新)
  - [使用方式](#使用方式)
    - [Linux](#linux)
    - [Windows](#windows)
      - [一键安装](#一键安装)
      - [手动安装](#手动安装)
  - [恢复](#恢复)
  - [补充](#补充)
    - [关于修改状态](#关于修改状态)
    - [关于Dialog](#关于dialog)
    - [关于表格](#关于表格)
    - [关于缩放](#关于缩放)
    - [关于自定义](#关于自定义)
    - [关于访问卡顿](#关于访问卡顿)
  - [声明](#声明)
  - [致谢](#致谢)
  - [交流](#交流)

</details>

### 最近更新

2020/8/25: 添加Windows一键安装脚本

<details>
<summary>历史更新</summary>

2020/8/21

- 更新了公会管理和成员管理页面

![group-manager](https://ihs.arcadia.cool/laipz8200/dWulAj.png?x-oss-process=style/zip)

- 更新了对linux用户更加友好的安装脚本

![shell](https://ihs.arcadia.cool/laipz8200/Screen%20Shot%202020-08-21%20at%2011.28.57%20PM.png?x-oss-process=style/zip)
</details>

-----

## 使用方式

### Linux

确认你安装了并且能够正常使用`Git`，在yobot根目录下运行
```shell
git clone https://github.com/laipz8200/YobotWebInterface.git
cd YobotWebInterface
chmod +x install.sh
./install.sh
```

### Windows

#### 一键安装

1. 下载本项目下的Powershell一键安装脚本`WebUIOneKeyScript.ps1`。[下载地址](https://github.com/laipz8200/YobotWebInterface/releases)
2. 将脚本放置在**和yobot安装目录同级的位置**，如果是hoshino插件版，该位置为第一层yobot目录。
3. 在Powershell中运行脚本。

#### 手动安装

1. clone本项目或下载zip到本地并解压。
2. 在`yobot/src/client/public`目录下新建`backup`文件夹，并将`static`和`template`两个文件夹移动至`backup`。
3. 将项目目录中的`static`和`template`两个文件夹移动到`yobot/src/client/public/`中(就是之前那两个文件夹在的地方)。

## 恢复

(2020/08/21) Linux系统现在可以通过再次运行安装脚本一键恢复了。

如果你严格按照说明进行操作，只需删除`yobot/src/client/public`目录下的`static`和`template`文件夹，并将`backup`中的备份文件恢复至原位即可。

## 补充

懒得写使用说明，在这里写点细节

### 关于修改状态

修改当前会战状态的方式为点击会战面板的血条，非管理点了不会有反应。

![修改状态](https://ihs.arcadia.cool/laipz8200/Screen%20Shot%202020-08-16%20at%206.08.55%20PM.png?x-oss-process=style/zip)

### 关于Dialog

移动端打开会默认从底部弹出，桌面端会显示在中央。

### 关于表格

应用中所有表格均可左右划动，若由于屏幕尺寸过小导致信息显示不全，请尝试划动。

### 关于缩放

为了移动平台能获得较好的体验，应用禁止了界面上的缩放。

### 关于自定义

`static`目录中可以更换应用的图标和背景，用同名文件替换即可。

### 关于访问卡顿

访问卡顿可能是由于CDN访问缓慢导致的，通常不会遇到，如果实在访问不了建议有能力的手动更换CDN地址，或试试[YoCool](https://github.com/A-kirami/YoCool)。

## 声明

本项目使用[Quasar](https://quasar.dev/)完成。

项目仅修改了[yobot](https://yobot.win/)的web页面涉及到的`HTML`和`JavaScript`文件，对yobot本身代码没有任何改动。

## 致谢

感谢[pcrbot/yobot](https://github.com/pcrbot/yobot)提供了项目的基础。

感谢[A-kirami/YoCool](https://github.com/A-kirami/YoCool)提供了查刀页面的布局参考，[YoCool](https://github.com/A-kirami/YoCool)是一个美观、可爱、精致的Yobot后台主题，欢迎尝试。

感谢[@corvo007](https://github.com/corvo007)提供的Windows一键安装脚本。

## 交流

[fiora - Arcadia](https://fiora.arcadia.cool/)

其他联系方式见项目内的"关于"页面。
