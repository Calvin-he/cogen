
deploy_api(){
    rsync -av --delete --exclude-from=.gitignore --exclude=public server_api/ dev@air:/home/www/ce/code/
}

deploy_ui(){
    cd lesson_admin
    npm install
    npm run build
    rsync -av --delete --exclude=**/*.map dist/ dev@air:/home/www/ce/code/public/admin/
    cd ..
}

deploy_we(){
    cd wechat_cli
    npm install
    npm run build
    rsync -av --delete --exclude=**/*.map dist/ dev@air:/home/www/ce/code/public/wechat/
    cd ..
}

case $1 in
    api)
        deploy_api
        ssh root@air '/home/www/ce/startServer.sh'
        ;;
    ui)
        deploy_ui
        ;;
    we)
        deploy_we
        ;;
    all)
        deploy_api
        deploy_ui
        deploy_we
        ssh root@air '/home/www/ce/startServer.sh'
        ;;
    *)
        echo "usage: ./deploy api|ui|we|all"
        exit 0
        ;;
esac


