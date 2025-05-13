# Solucionador de Ecuaciones No Lineales

Aplicación web para resolver ecuaciones no lineales usando los métodos de Bisección y Newton-Raphson, con visualización de resultados y métricas de rendimiento.

## Requisitos
- Docker y Docker Compose instalados.
- Navegador web moderno.

## Instrucciones para ejecutar

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd nonlinear-equation-solver
   ```

2. Construye y ejecuta el contenedor con Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Accede a la aplicación en:
   ```
   http://localhost:8080
   ```

4. Para detener los contenedores:
   ```bash
   docker-compose down
   ```

## Estructura del proyecto
- `public/`: Archivos estáticos (HTML, CSS, JS).
- `Dockerfile`: Configuración de la imagen Nginx.
- `docker-compose.yml`: Orquestación del servicio web.

## Autores
- Nestor Fabian Cabrera
- Alvaro Andrés Mejía
