require('dotenv').config(); // Variables de entorno

const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');

//* Crear el servidor de express
const app = express();

//* Base de Datos
dbConnection()

//* Cors
app.use(cors());

//* Directorio Público
app.use(express.static('public')); // En express, esto es un middleware

//* lectura y parseo del body
app.use(express.json());

//* Rutas
app.use('/api/auth', require('./routes/auth'));
// TODO: CRUD: Eventos

//* Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor ejecutandose en el puerto ${process.env.PORT}`);
});