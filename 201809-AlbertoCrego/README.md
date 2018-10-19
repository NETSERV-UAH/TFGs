
## Resumen del trabajo:

> El desarrollo de este trabajo de final de grado analiza, define e implementa una simulación propuesta para un nuevo paradigma dentro de las telecomunicaciones, denominado como Fog Computing.
> Esta idea trata de acercar las aplicaciones finales a los consumidores,basado en tres ideas: la arquitectura de microservicios, un software que permita orquestarlos y las redes de 5G que tienen nuevas características técnicas. Este TFG, se centrará en la simulación de la parte software, su implementación y despliegue, demostrando ventajas en entornos domésticos y su posible potencia en un posterior desarrollo de arquitecturas complejas.
> Explicación de los documentos y ficheros usados para la ejecución del TFG:


## Ficheros

>  -  **docker-webPage** Incluye los ficheros de despliegue y dos scripts de automatización, uno para eliminarlos todos y otro para crearlos:
> -- **app-python:** Fichero de aplicación `app.py` con el script de la página web. Dockerfile para la creación del contenedor y basado en una imagen especifica de ARM (para su uso en RPi). Dos YAML de despliegue uno para aplicaciones en AMD64 y otro para aplicacicones en ARM. Por último un YAML con un objeto Service para definir
> -- **nginx** Carpeta con la configuración propia de nginx (nginx.conf). Carpeta 'www' con varios HTML estáticos de ejemplo y pruebas. Servicios y despliegues de los componentes NGINX.
>  -  **draw.io:** Ficheros XML/JPEG/PNG de los diagramas usados en el proyecto.
>  -  **gcp-live-k8s-visualizer:** Ficheros descargados del repositorio `https://github.com/brendandburns/gcp-live-k8s-visualizer`. Crea un entorno gráfico web para conocer el estado de pods y nodos.
>  -  **http-request-capture:** Ficheros con los sniffer de tráfico: uno para el worker00, otro para el worker01 y el original del repositorio `https://github.com/jacklam718/http-request-capture`.
>  -  **nodeSelector:** Scripts que se ejecutan en las maquinas remotas y modifican la variable `nodeSelector` haciendo que se desplacen los pods de un worker a otro.
>  -  **PPT:** Presentación oficial del Trabajo de Final de Grado.
>  -  **stress:** Script para pruebas de estres en el escalado dinámico de pods. No se uso en el trabajo.
>  -  **waved_net:** Configuración modificada del proxy de red de Kubernetes.



Alberto Crego Matas - Grado en Ingenería de Telecomunicaciones / Telemática
