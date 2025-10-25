// Pool de conexiones a la db
import mysql from 'mysql2/promise';
import loadEnv from '../utils/loadEnv.js';
import log from '../utils/log.js';

loadEnv();

const pool = mysql.createPool({
  uri: process.env.DB_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then((connection) => {
    log.info('Conexión a la base de datos establecida!');
    connection.release();
  })
  .catch((error) => {
    log.error('Error al establecer la conexión a la base de datos:');
    log.error(error);
  });

export default pool;