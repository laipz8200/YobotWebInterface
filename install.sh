echo "================ 执行操作前请先确认本目录位于yobot根目录下 ================="
echo "1. 安装(适用于从未使用过本美化程序的人)"
echo "2. 更新(适用于之前使用本脚本安装美化的人)"
echo "3. 卸载并恢复(适用于之前使用本脚本安装美化的人)"
echo "============================   警告   ================================="
echo "警告！如果你之前从未使用过本美化插件或不是通过脚本自动安装，请不要进行更新和卸载操作"
read -p "请选择要执行的操作:" select
if [ $select == "1" ];
then
    mkdir ../src/client/public/backup
    mv ../src/client/public/static ../src/client/public/backup/static
    mv ../src/client/public/template ../src/client/public/backup/template

    cp -r static ../src/client/public/
    cp -r template ../src/client/public/
elif [ $select == "2" ];
then
    rm -r ../src/client/public/static
    rm -r ../src/client/public/template

    cp -r static ../src/client/public/
    cp -r template ../src/client/public/
elif [ $select == "3" ];
then
    rm -r ../src/client/public/static
    rm -r ../src/client/public/template

    mv ../src/client/public/backup/static ../src/client/public/static
    mv ../src/client/public/backup/template ../src/client/public/template

    rmdir ../src/client/public/backup
else
echo "输入无效. 请输入[1-3]中的数字"
fi
