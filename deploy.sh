if [ "$1" = "api" ]; then
    rsync -av --delete --exclude=node_modules --exclude=public server_api/ dev@de2:/home/www/eyang/airflow/ce/code/
fi

if [ "$1" = "ui" ]; then
    cd lesson_admin
    npm install
    npm run build
    rsync -av --delete --exclude=**/*.map dist/ dev@de2:/home/www/eyang/airflow/ce/code/public/
fi
ssh dev@de2 '/home/www/eyang/airflow/ce/startServer.sh'
