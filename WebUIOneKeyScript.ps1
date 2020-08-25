$ErrorActionPreference = "SilentlyContinue"
$loop = $true

$choice = Read-Host "
注意：执行操作前请确认本脚本位于yobot根目录下！
本脚本当前执行位置：$PSScriptRoot
===============命令菜单==================
1.全新安装
2.卸载并恢复
3.更新
警告：若之前没有通过本脚本安装，请勿执行卸载命令！
========================================
请选择要执行的操作(请输入数字序号):
"


switch ($choice) 
{
    1 
    { 
        $loop = $false
        git clone https://github.com/laipz8200/YobotWebInterface.git
        if (!$?) 
        {
            Write-Output "你没装git！/ 你网络不好！"
        }
        New-Item .\yobot\src\client\pubilc\backup -ItemType Directory
        Copy-Item .\yobot\src\client\pubilc\static .\yobot\src\client\pubilc\backup -Recurse -Force
        Copy-Item .\yobot\src\client\pubilc\template .\yobot\src\client\pubilc\backup -Recurse -Force
        Remove-Item .\yobot\src\client\pubilc\static -Force
        Remove-Item .\yobot\src\client\pubilc\template -Force
        Copy-Item  .\YobotWebInterface\static .\yobot\src\client\pubilc
        Copy-Item  .\YobotWebInterface\template .\yobot\src\client\pubilc
        Write-Output "安装完成！"
     }
    2 
    {
        $loop = $false
        Remove-Item .\yobot\src\client\pubilc\static -Force
        Remove-Item .\yobot\src\client\pubilc\template -Force
        Copy-Item  .\yobot\src\client\pubilc\backup\static .\yobot\src\client\pubilc
        Copy-Item  .\yobot\src\client\pubilc\backup\template .\yobot\src\client\pubilc
        Remove-Item .\yobot\src\client\pubilc\backup -Recurse -Force
        Write-Output "卸载完成！"
    } 
    3 
    {
        Test-Path .\YobotWebInterface
        {
            Set-Location .\YobotWebInterface
            git pull
            if (!$?) 
            {
                Write-Output "你没装git！/ 你网络不好！"
            }
            Set-Location ..\
            Test-Path .\yobot\src\client\pubilc\backup
            {
                Remove-Item .\yobot\src\client\pubilc\backup -Force -Recurse
                New-Item .\yobot\src\client\pubilc\backup -ItemType Directory
                Copy-Item .\yobot\src\client\pubilc\static .\yobot\src\client\pubilc\backup -Recurse -Force
                Copy-Item .\yobot\src\client\pubilc\template .\yobot\src\client\pubilc\backup -Recurse -Force
            }
            else {
                New-Item .\yobot\src\client\pubilc\backup -ItemType Directory
                Copy-Item .\yobot\src\client\pubilc\static .\yobot\src\client\pubilc\backup -Recurse -Force
                Copy-Item .\yobot\src\client\pubilc\template .\yobot\src\client\pubilc\backup -Recurse -Force
            }
            Remove-Item .\yobot\src\client\pubilc\static -Force
            Remove-Item .\yobot\src\client\pubilc\template -Force
            Copy-Item  .\YobotWebInterface\static .\yobot\src\client\pubilc
            Copy-Item  .\YobotWebInterface\template .\yobot\src\client\pubilc
            
        }
        else {
            Write-Output "你原来的文件都没有你更新你ma呢？"
        }
    }
    Default 
    {
        $loop = $true
    }
}
