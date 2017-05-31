rsync -av --delete --exclude=node_modules server_api/ dev@de2:/home/www/eyang/airflow/ce/code/

cd lesson_admin
if [ "$1" = "ui" ]; then
    npm install
    npm run build
fi
rsync -av --delete --exclude=**/*.map dist/ dev@de2:/home/www/eyang/airflow/ce/code/public/
#ssh dev@de2 '/home/www/eyang/airflow/ce/startServer.sh'
