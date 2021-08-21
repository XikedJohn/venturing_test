# Venturing Test - Colección de películas
Pasos para ejecutar el proyecto localmente:
1) Levantar un servidor web con una aplicación como XAMPP y crear una base de datos con una tabla que contenga al menos los campos:
    - title (Primary Key) VARCHAR(255)
    - year VARCHAR(4) null
    - genre VARCHAR(50) null
    - director VARCHAR(50) null
2) Descargar los directorios de "back" y "front" y ejecutar npm install sobre cada directorio para instalar todas las dependencias.
3) Usar el fichero "Config.js" del directorio "back" para configurar conexiones, limites de consulta, campos que se van a utilizar de la base de datos, etc.
4) Ejecutar npm start en el directorio "back" y luego en el directorio "front".

Consideraciones para pruebas de las APIs y de la aplicación:
- Al envíar POST request para crear nuevos registros se requiere envíar un array de objetos aún cuando se envíe uno solo.
- Para las consultas de registros se puede usar el parametro "offset".
- Los CSV requieren contar con encabezado para subir correctamente, usando los campos correspondientes de la tabla.
