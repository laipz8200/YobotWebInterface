# yobot on quasar

本项目使用[Quasar](https://quasar.dev/)对yobot的web管理界面进行调整，提供对PC和移动端更好的布局适配以及更友好的交互逻辑。

ps.管理页和统计页未做，随缘更新。

## 使用方式

### Linux

确认你安装了并且能够正常使用`Git`，在yobot根目录下运行
```shell
git clone https://github.com/laipz8200/yobot-quasar.git
cd yobot-quasar
chmod +x install.sh
./install.sh
```

### Windows

1. clone本项目或下载zip到本地并解压。
2. 在`yobot/src/client/public`目录下新建`backup`文件夹，并将`static`和`template`两个文件夹移动至`backup`。
3. 将项目目录中的`static`和`template`两个文件夹移动到`yobot/src/client/public/`中(就是之前那两个文件夹在的地方)。

## 恢复

如果你严格按照说明进行操作，只需删除`yobot/src/client/public`目录下的`static`和`template`文件夹，并将`backup`中的备份文件恢复至原位即可。

## 声明

本项目使用[Quasar](https://quasar.dev/)完成。

项目仅修改了[yobot](https://yobot.win/)的web页面涉及到的`HTML`和`JavaScript`文件，对yobot本身代码没有任何改动。

## 致谢

感谢[pcrbot/yobot](https://github.com/pcrbot/yobot)提供了项目的基础。

感谢[A-kirami/YoCool](https://github.com/A-kirami/YoCool)提供了查刀页面的布局参考，[YoCool](https://github.com/A-kirami/YoCool)是一个美观、可爱、精致的Yobot后台主题，欢迎尝试。

## 交流

[fiora - Arcadia](https://fiora.arcadia.cool/)

其他联系方式见项目内的"关于"页面。
