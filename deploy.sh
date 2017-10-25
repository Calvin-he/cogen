deploy_api(){
    rsync -av --delete --exclude-from=.gitignore --exclude=public server_api/ -e "ssh -p 42424" dev@air:/home/www/ce/code/
}

deploy_admin(){
    cd lesson_admin
    npm install
    npm run build
    rsync -av --delete --exclude=**/*.map dist/ -e "ssh -p 42424" dev@air:/home/www/ce/code/public/admin/
    cd ..
}

deploy_we(){
    cd wechat_cli
    npm install
    npm run build
    rsync -av --delete --exclude=**/*.map dist/ -e "ssh -p 42424" dev@air:/home/www/ce/code/public/wechat/
    cd ..
}

case $1 in
    api)
        deploy_api
        ssh root@air -p 42424 '/home/www/ce/startServer.sh' 
        ;;
    admin)
        deploy_admin
        ;;
    we)
        deploy_we
        ;;
    all)
        deploy_admin
        deploy_we
        deploy_api
        ssh root@air -p 42424 '/home/www/ce/startServer.sh'
        ;;
    *)
        echo "usage: ./deploy api|admin|we|all"
        exit 0
        ;;
esac


