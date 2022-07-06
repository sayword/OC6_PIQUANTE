const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Création de l'utilisateur + hashage
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 4)//hashage du mot de passe x4
      .then(hash => {//on crée l'utilisateur dans la base de données
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })//trouve le mail dans la base de données
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'identifiant ou mot de passe incorrect' });
        }
        bcrypt.compare(req.body.password, user.password)//compare le mot de passe reçu avec le hash dans la base de données
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'identifiant ou mot de passe incorrect' });
            }
            res.status(200).json({
                userId: user._id,
                token: 'TOKEN'
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };