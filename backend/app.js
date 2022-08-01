require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path'); //pour les images je crois qu'il ne me reste plus que ça
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

mongoose.connect(process.env.MONGO_USER, //connexion a mongoDB avec dotenv
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => { // header pour faire le lien entre le 3000 et le 4200 erreur CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;