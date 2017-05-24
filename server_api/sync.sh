rsync -av --delete --exclude=node_modules --exclude=.git --exclude=sync.sh . dev@de2:/home/www/eyang/airflow/ce/code/
ssh dev@de2 '/home/www/eyang/airflow/ce/startServer.sh'
