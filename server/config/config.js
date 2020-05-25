// ===============
// Puerto
// ===============

process.env.PORT = process.env.PORT || 3000


// ===============
// Entorno
// ===============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===================
// Caducidad del token
// ===================
// 60segundos * 60minutos * 24horas * 30días = 1MES

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =====================
// SEED de autenticación
// =====================

process.env.SEED = process.env.SEDD || 'seed-de-desarrollo';


// ===============
// Base de datos
// ===============

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {

    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// =====================
//  Google Client ID
// =====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '938031781595-fhvnvf8eek6s1rsme2ifbj27usqhvt2l.apps.googleusercontent.com';