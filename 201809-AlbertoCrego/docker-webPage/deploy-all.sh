echo "Creando despliegues app-python...\n"
sleep 1

cd app-python/
kubectl create -f python-svc.yaml
kubectl create -f python-deploy.yaml

# echo "Creando despliegues app-python2...\n"
# sleep 1
# cd ..
# cd app-python2/
# kubectl create -f python-svc.yaml
# kubectl create -f python-deploy.yaml

echo "Creando despliegues nginx...\n"
sleep 1
cd ..
cd nginx/
kubectl create -f nginx-deploy.yaml
kubectl create -f nginx-svc.yaml

echo "Importando configmap..."
cd nginx
kubectl create configmap nginx-conf --from-file=configure-pod/nginx.conf
kubectl create configmap www-nginx --from-file=www/ 


echo "Etiquetando nodos"
kubectl label nodes worker00-desktop tfg=worker00
kubectl label nodes worker01-desktop tfg=worker01