# Venturing Test - Colección de películas
Pasos para ejecutar el proyecto localmente:
1) Levantar un servidor web con una aplicación como XAMPP y crear una base de datos con una tabla que contenga al menos los campos:
    1)title (Primary Key) VARCHAR(255)
    2) year VARCHAR(4) null
    3) genre VARCHAR(50) null
    4) director VARCHAR(50) null
2) Descargar los directorios de "back" y "front" y ejecutar npm install para instalar todas las dependencias
3) Usar el fichero "Config.js" del directorio "back" para configurar conexiones, limites de consulta, campos que se van a utilizar de la base de datos, etc.
4) Ejecutar npm start en el directorio "back" y luego en el directorio "front"
