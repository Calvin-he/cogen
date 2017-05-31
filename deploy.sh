
deploy_api() {
    rsync -av --delete --exclude=node_modules --exclude=public server_api/ dev@de2:/home/www/eyang/airflow/ce/code/
}

deploy_ui(){
    cd lesson_admin
    npm install
    npm run build
    rsync -av --delete --exclude=**/*.map dist/ dev@de2:/home/www/eyang/airflow/ce/code/public/
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
        ;;
esac

ssh dev@de2 '/home/www/eyang/airflow/ce/startServer.sh'
