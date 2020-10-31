workdir=$(pwd)
target_dir="YobotWebInterface"
rc2_file="yobot/src/client/public/template/user-info-rc2.html"
backup_dir="yobot/src/client/public/backup"
yobot_dir="yobot/src"

download_from_github() {
    echo "正在下载项目文件..."
    git clone https://github.com/laipz8200/YobotWebInterface.git
    if [ $? -ne 0 ]; then
        echo "你没有安装git或网络状况不佳，请安装或调整网络环境后重试"
    else
        echo "项目文件下载成功"
    fi
}

update_from_github() {
    echo "正在更新项目文件..."
    cd YobotWebInterface
    git pull origin master
    if [ $? -ne 0 ]; then
        echo "你没有安装git或网络状况不佳，请安装或调整网络环境后重试"
    else
        echo "项目文件更新成功"
    fi
    cd ..
}

backup_file() {
    mkdir yobot/src/client/public/backup
    mv yobot/src/client/public/static yobot/src/client/public/backup/static
    mv yobot/src/client/public/template yobot/src/client/public/backup/template
}

install_file() {
    cp -r YobotWebInterface/static yobot/src/client/public/
    cp -r YobotWebInterface/template yobot/src/client/public/
}

replace_for_rc2() {
    mv yobot/src/client/public/template/user-info-rc2.html yobot/src/client/public/template/user-info.html
}

delete_file() {
    rm -r yobot/src/client/public/static
    rm -r yobot/src/client/public/template
}

find_yobot() {
    if [ ! -d $yobot_dir ]; then
        echo "未找到yobot目录，无法执行安装"
        exit 1
    fi
}

echo "================= 执行操作前请先确认本脚本与yobot目录同级 =================="
echo "1. 为yobot[v3.6.4-rc.1]或更早版本安装"
echo "2. 为yobot[v3.6.4-rc.2]或更新版本安装"
echo "3. 更新(适用于之前使用本脚本安装美化的人)"
echo "4. 卸载并恢复(适用于之前使用本脚本安装美化的人)"
echo "===============================   警告   ==================================="
echo "警告！如果你之前从未使用过本美化插件或不是通过脚本自动安装，请不要进行更新和卸载操作"
echo "当前脚本运行位置: $workdir"
read -p "请选择要执行的操作:" select
if [ $select == "1" ]; then
    find_yobot
    if [ ! -d $target_dir ]; then
        download_from_github
    else
        echo "已有项目目录，建议选择更新"
        exit 1
    fi
    echo "正在创建备份..."
    backup_file
    echo "正在安装美化..."
    install_file
    echo "安装完成"
elif [ $select == "2" ]; then
    find_yobot
    if [ ! -d $target_dir ]; then
        download_from_github
    else
        echo "已有项目目录，建议选择更新"
        exit 1
    fi
    echo "正在创建备份..."
    backup_file
    echo "正在安装美化..."
    install_file
    replace_for_rc2
    echo "安装完成"
elif [ $select == "3" ]; then
    if [ -d $target_dir ]; then
        if [ -a $rc2_file ]; then
            echo "检测到你安装的是yobot[v3.6.4-rc.1]版本"
            update_from_github
            echo "开始执行更新"
            delete_file
            install_file
            echo "更新完成"
        else
            echo "检测到你安装的是yobot[v3.6.4-rc.2]版本"
            update_from_github
            echo "开始执行更新"
            delete_file
            install_file
            replace_for_rc2
            echo "更新完成"
        fi
    else
        echo "没有找到项目目录，请确认脚本运行位置无误"
        exit 1
    fi
elif [ $select == "4" ]; then
    if [ ! -d $backup_dir ]; then
        echo "未找到备份目录，无法执行卸载操作"
        exit 1
    fi
    echo "正在删除美化文件"
    delete_file

    echo "正在恢复源文件"
    mv yobot/src/client/public/backup/static yobot/src/client/public/static
    mv yobot/src/client/public/backup/template yobot/src/client/public/template

    echo "正在删除备份目录"
    rmdir yobot/src/client/public/backup
    echo "正在删除项目目录"
    rm -r YobotWebInterface
    echo "卸载完毕，感谢您的使用"
else
    echo "输入无效. 请输入[1-4]中的数字"
fi
