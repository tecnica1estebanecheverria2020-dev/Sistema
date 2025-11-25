// Importaciones de dependencias 
import express from 'express';
import cors from 'cors';
import logger from './middlewares/logger.js';
import loadEnv from './utils/loadEnv.js';
import cookieParser from 'cookie-parser';
import loadStaticFiles from './utils/loadStaticsFiles.js'
import log from './utils/log.js';
// Validacion de autenticacion y admin
// import { requireAuth, requireAdmin } from './middlewares/authMiddleware.js';

// Importaciones de rutas
import authRoutes from './routes/auth.js';
import inventarioRoutes from './routes/inventario.js';
import loansRoutes from './routes/loans.js';
import rolesRoutes from './routes/roles.js';
import schedulesRoutes from './routes/schedules.js';
import dashboardRoutes from './routes/dashboard.js';
import catalogsRoutes from './routes/catalogs.js';
import usersRoutes from './routes/users.js';

// Middlewares
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Cargar variables de entorno
loadEnv();

// Validar entorno (Desarrollo o Produccion)
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
    log.info('Modo de desarrollo')

    app.use(logger);
    app.use(cors({
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
        credentials: true,
    }));
} else {
    log.info('Modo de produccion')
}

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/catalogs', catalogsRoutes);
app.use('/api/users', usersRoutes);

// Testeo de api
app.get('/api/test', async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Servidor operativo',
      connection: true,
      timestamp: new Date().toISOString()
    });
});

// Servir archivos estaticos de la build de Vite
if (isProduction) loadStaticFiles(app);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Prender servidor de solicitudes http 
const port = process.env.PORT || 5001;
app.listen(port, () => log.info(`Server escuchando en el puerto ${port}`));
