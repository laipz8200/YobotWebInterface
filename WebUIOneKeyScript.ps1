<#
安装应该干的事：
1.检查是否有项目文件夹，有则提示更新并中断
2.从git拉取项目文件夹
3.读取user-info.html中的特征字符串("公会战所在群"or"公会战主群")，判断版本
4.创建备份文件夹并复制文件并删除源文件
5.复制模板文件
6.结束
更新应该干的事：
1.去到项目文件仓库，pull最新版本的网页
2.删除原备份文件，并重新创建
3.按照template中是否有user-info-rc2.html的方法，判断版本
4.删除原来的文件，并复制进去
5.结束
卸载应该干的事：
1.检查备份文件夹是否存在，无则中断
2.清空网页文件夹，并复制备份文件
3.删除项目文件夹
4.结束

我是憨批，我就应该写脚本的时候理一下流程的，就不至于出这么多bug
如果这次commit之后还有bug请让我爪巴
我确实没想到这么简单的一个脚本能绕这么久，wsfw
#>
$ErrorActionPreference = "SilentlyContinue"
function BackupFile{
        New-Item .\yobot\src\client\backup -ItemType Directory 
        Copy-Item .\yobot\src\client\public\* .\yobot\src\client\backup -Recurse -Force
}

function RestoreFile{
        Copy-Item  .\yobot\src\client\backup\* .\yobot\src\client\public -Force -Recurse
}

function RemoveFile{
        Remove-Item .\yobot\src\client\public\* -Force -Recurse
}

function InstallFile{
        Copy-Item  .\YobotWebInterface\* .\yobot\src\client\public -Force -Recurse
}
function Install {
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
    if (Test-Path .\yobot\src\client\backup){
        RemoveFile
        RestoreFile
        Remove-Item .\yobot\src\client\backup -Recurse -Force
        Remove-Item .\YobotWebInterface -Recurse -Force
        Write-Output "卸载完成！"
    }
    else{
        Write-Output "警告：未检测到备份目录，将中断程序执行。"
        break
    } 
}

function DetectVersion{
    $tmpContent = Get-Content .\yobot\src\client\public\template\user-info.html -Encoding UTF8
    if ("$tmpContent".Contains("公会战主群")) {
        $Version = "v3.6.4-rc.2"
    }
    else {
        $Version = "Others"
        
    }
    Write-Output "侦测到当前版本为$Version"
}

function DetectVersionForUpdate {
    if (Test-Path .\yobot\src\client\public\template\user-info-rc2.html) {
        $UpdateVersion = "Others" 
    }
    else {
        $UpdateVersion = "v3.6.4-rc.2"
    }
    Write-Output "侦测到当前版本为$UpdateVersion"
}

function rename{
    Set-Location .\yobot\src\client\public\template
    Remove-Item user-info.html
    Rename-Item user-info-rc2.html user-info.html
    <# md我sb了，这个只是重命名并覆盖，应该再加一行删除源文件的，不然人 人 都 是 r c 1 #>
    <# Rename-Item这个命令只能重命名不能覆盖，所以应该先扬了源文件在重命名，但是我又忘了删掉删除rc2的命令，谢谢，有被蠢到。我简直就是tm的five #>
    Set-Location ..\..\..\..\..\
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
            if(Test-Path .\yobot\src\client\backup)
            {
                Remove-Item .\yobot\src\client\backup -Force -Recurse
                BackupFile
            }
            else {
                BackupFile
            }
            RemoveFile
            InstallFile
            Write-Output "更新完成！"
}

Write-Output "
注意：执行操作前请确认本脚本与内层yobot目录(插件版)/yobot目录(源码版)位于同级目录！

本脚本当前执行位置：$PSScriptRoot
===============命令菜单=================
1.全新安装
2.卸载并恢复
3.更新
警告：若之前没有通过本脚本安装，请勿执行卸载命令！
========================================"

$choice = Read-Host "请选择要执行的操作(请输入数字序号)"

set-Location $PSScriptRoot

switch ($choice) 
{
    1 
    { 
        if (Test-Path .\YobotWebInterface)
        {
            Write-Output "已经有本项目文件夹了，建议去更新"
            break
        }
        DetectVersion
        Install
        $InnerVersion = "v3.6.4-rc.2"
        $Result = $Version -eq $InnerVersion
        if ($Result = "true") {
            #Write-Output "rc2"
            rename
        }
        else {
            #Write-Output "others"
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
            DetectVersionForUpdate
            $InnerVersion = "v3.6.4-rc.2"
            $Result = $UpdateVersion -eq $InnerVersion
            if ($Result = "true") {
            #Write-Output "rc2"
            Update
            rename
            Exit
            } 
            else {
                #Write-Output "other"
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
    <#4
    {
        DetectVersionForUpdate
        DetectVersion
    }#>
    Default 
    {
        Write-Output "你什么都没选哦~"
        break
    }
}


