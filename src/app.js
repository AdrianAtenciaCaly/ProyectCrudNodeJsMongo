import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import bookRoutes from './routes/book.route.js';
import bodyParser from 'body-parser';

config();

// Usamos express para los middlewares
const app = express();
app.use(bodyParser.json()); // Parseador de Bodies

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME });

// Evento de conexión exitosa
mongoose.connection.on('connected', () => {
    console.log('✅ Conexión exitosa a MongoDB');
});

// Evento de error en la conexión
mongoose.connection.on('error', (err) => {
    console.error('❌ Error en la conexión a MongoDB:', err);
});

// Evento de desconexión
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ Desconectado de MongoDB');
});

// Usar rutas
app.use('/books', bookRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`🚀 Server iniciado en el puerto ${port}`);
});
