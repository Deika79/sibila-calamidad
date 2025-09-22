# Sibila Calamidad - Tienda (Docker)

Requisitos: Docker y Docker Compose instalados en tu máquina.

1. Copia la estructura de carpetas y archivos en un directorio `sibila-calamidad/`.
2. (Opcional) Modifica contraseñas en `docker-compose.yml` o crea un `.env` con las credenciales.
3. Desde la raíz del proyecto:
   docker-compose up --build

Servicios:
- Frontend (SPA): http://localhost:8080
- Backend API: http://localhost:5000 (endpoints /api/products, /api/orders)
- MySQL: puerto 3306
- phpMyAdmin: http://localhost:8081 (usuario root / contraseña rootpassword por defecto)

Para detener:
  docker-compose down

Notas:
- El fichero `db/init.sql` se ejecuta la primera vez que MySQL arranca y crea tablas + productos de ejemplo.
- En producción, cambia las contraseñas y no expongas MySQL directamente a internet.
