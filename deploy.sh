
deploy_api() {
    rsync -av --delete --exclude=node_modules --exclude=public server_api/ dev@air:/home/www/ce/code/
}

deploy_ui(){
    cd lesson_admin
    npm install
    npm run build
    rsync -av --delete --exclude=**/*.map dist/ dev@air:/home/www/ce/code/public/admin/
}

case $1 in
    api)
        deploy_api
        ;;
    ui)
        deploy_ui
        ;;
    all)
        deploy_api
        deploy_ui
        ;;
    *)
        echo "usage: ./deploy api|ui|all"
        exit 0
        ;;
esac

ssh root@air '/home/www/ce/startServer.sh'
