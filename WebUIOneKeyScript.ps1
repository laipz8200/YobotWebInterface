$ErrorActionPreference = "inquire"

Write-Output "
注意：执行操作前请确认本脚本与[插件版]yobot**内层**目录或[源码版]yobot目录位于同级目录！

本脚本当前执行位置：$PSScriptRoot
===============命令菜单==================
1.全新安装
2.卸载并恢复
3.更新
警告：若之前没有通过本脚本安装，请勿执行卸载命令！
========================================"

$choice = Read-Host "请选择要执行的操作(请输入数字序号)"


switch ($choice) 
{
    1 
    { 
        if (Test-Path .\YobotWebInterface)
        {
            Write-Output "已经有本项目文件夹了，建议去更新"
            break
        }
        git clone https://github.com/laipz8200/YobotWebInterface.git
        if (!$?) 
        {
            Write-Output "你没装git！/ 你网络不好！"
            break
        }
        New-Item .\yobot\src\client\public\backup -ItemType Directory
        Copy-Item .\yobot\src\client\public\static .\yobot\src\client\public\backup -Recurse -Force
        Copy-Item .\yobot\src\client\public\template .\yobot\src\client\public\backup -Recurse -Force
        Remove-Item .\yobot\src\client\public\static -Force -Recurse
        Remove-Item .\yobot\src\client\public\template -Force -Recurse
        Copy-Item  .\YobotWebInterface\static .\yobot\src\client\public
        Copy-Item  .\YobotWebInterface\template .\yobot\src\client\public
        Write-Output "安装完成！"
        exit
    }
    2 
    {
        Remove-Item .\yobot\src\client\public\static -Force -Recurse
        Remove-Item .\yobot\src\client\public\template -Force -Recurse
        Copy-Item  .\yobot\src\client\public\backup\static .\yobot\src\client\public
        Copy-Item  .\yobot\src\client\public\backup\template .\yobot\src\client\public
        Remove-Item .\yobot\src\client\public\backup -Recurse -Force
        Write-Output "卸载完成！"
        exit
    } 
    3 
    { 
        if(Test-Path .\YobotWebInterface)
        {
            Set-Location .\YobotWebInterface
            git pull
            if (!$?) 
            {
                Write-Output "你没装git！/ 你网络不好！"
                break
            }
            Set-Location ..\
            if(Test-Path .\yobot\src\client\public\backup)
            {
                Remove-Item .\yobot\src\client\public\backup -Force -Recurse
                New-Item .\yobot\src\client\public\backup -ItemType Directory
                Copy-Item .\yobot\src\client\public\static .\yobot\src\client\public\backup -Recurse -Force
                Copy-Item .\yobot\src\client\public\template .\yobot\src\client\public\backup -Recurse -Force
            }
            else {
                New-Item .\yobot\src\client\public\backup -ItemType Directory
                Copy-Item .\yobot\src\client\public\static .\yobot\src\client\public\backup -Recurse -Force
                Copy-Item .\yobot\src\client\public\template .\yobot\src\client\public\backup -Recurse -Force
            }
            Remove-Item .\yobot\src\client\public\static -Force -Recurse
            Remove-Item .\yobot\src\client\public\template -Force -Recurse
            Copy-Item  .\YobotWebInterface\static .\yobot\src\client\public
            Copy-Item  .\YobotWebInterface\template .\yobot\src\client\public
            Write-Output "更新完成！"
            exit
            
        }
        else 
        {
        Write-Output "没有项目文件夹，建议选择安装"
        break
        }
    }
    Default 
    {
        Write-Output "你什么都没选哦~"
        break
    }
}


