echo "Eliminando despliegues app-python...\n"
sleep 1

cd app-python/
kubectl delete svc web-get -n tfg
kubectl delete deployments web-get -n tfg

# echo "Eliminando despliegues app-python2...\n"
# sleep 1
# kubectl delete svc web-set
# kubectl delete deployments web-set

echo "Eliminando despliegues nginx...\n"
sleep 1
kubectl delete svc web-nginx -n tfg
kubectl delete deployments web-nginx -n tfg

echo "Eliminando configmap..."
kubectl delete configmap nginx-conf
