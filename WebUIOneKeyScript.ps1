$ErrorActionPreference = "SilentlyContinue"
function BackupFile{
        Copy-Item .\yobot\src\client\public\static .\yobot\src\client\public\backup -Recurse -Force
        Copy-Item .\yobot\src\client\public\template .\yobot\src\client\public\backup -Recurse -Force   
}

function RestoreFile{
        Copy-Item  .\yobot\src\client\public\backup\static .\yobot\src\client\public -Force -Recurse
        Copy-Item  .\yobot\src\client\public\backup\template .\yobot\src\client\public -Force -Recurse
}

function RemoveFile{
        Remove-Item .\yobot\src\client\public\static\* -Force -Recurse
        Remove-Item .\yobot\src\client\public\template\* -Force -Recurse
}

function InstallFile{
        Copy-Item  .\YobotWebInterface\static .\yobot\src\client\public -Force -Recurse
        Copy-Item  .\YobotWebInterface\template .\yobot\src\client\public -Force -Recurse
}
function Install {
        New-Item .\yobot\src\client\public\backup -ItemType Directory
        BackupFile
        git clone https://github.com/laipz8200/YobotWebInterface.git
        if (!$?) 
        {
            Write-Output "你没装git！/ 你网络不好！"
            break
        }
        RemoveFile
        InstallFile
}

function Uninstall{
    if (Test-Path .\yobot\src\client\public\backup){
        RemoveFile
        RestoreFile
        Remove-Item .\yobot\src\client\public\backup -Recurse -Force
        Remove-Item .\YobotWebInterface -Recurse -Force
        Write-Output "卸载完成！"
    }
    else{
        Write-Output "警告：未检测到备份目录，将中断程序执行。"
        break
    } 
}

function DetectVersion{
    if (Test-Path .\yobot\src\client\public\template\user-info-rc2.html){
        $Version = "Others" 
    }
    else {
        $Version = "3.6.4-rc.2"
    }
}

function rename{
    Rename-Item .\yobot\src\client\public\template\user-info-rc2.html .\yobot\src\client\public\template\user-info.html
}

function Update{
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
                Remove-Item .\yobot\src\client\public\backup\* -Force -Recurse
                BackupFile
            }
            else {
                New-Item .\yobot\src\client\public\backup -ItemType Directory
                BackupFile
            }
            RemoveFile
            InstallFile
            Write-Output "更新完成！"
}

Write-Output "
注意：执行操作前请确认本脚本与内层yobot目录(插件版)/yobot目录(源码版)位于同级目录！

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
        Install
        DetectVersion
         if ($Version -eq "3.6.4-rc.2"){
             rename
         }
        Write-Output "安装完成！"
        Exit
    }
    2 
    {
    Uninstall
    Exit 
    } 
    3 
    { 
        if(Test-Path .\YobotWebInterface)
        {
        DetectVersion
            if ($Version -eq "3.6.4-rc.2"){
            Update
            rename
            Exit
            } 
            else {
                Update
                Exit
            }   
            
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


