const Sauce = require('../models/sauce');
const fs = require('fs');

//créer une sauce
const createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

//montre la sauce selectionnée
const getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//modifie la sauce
const modifySauce = (req, res, next) => {
  console.log(req.body, req.file);
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          console.log(req.body.userId);
          if (req.body.userId !== process.userId)  {
            return res.status(403).json({message : "Vous n'avez pas la permission"});
          } else{
    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
      .then(res.status(200).json({ message: "Sauce modifiée" }))
      .catch(error => res.status(400).json({ error }))
}});
}

//Supprime la sauce en question
const deleteSauce = (req, res, next) => {
  const userId = req.body.userId;
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      console.log(req.body.userId);
      if (userId !== process.userId)  {
        return res.status(403).json({message : "Vous n'avez pas la permission"});
      } else{
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
            .catch(error => res.status(400).json({ error }));
        });
      }
    })
    .catch(error => res.status(500).json({ error }));
};

//montre toutes les sauces
const getAllStuff = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    } 
  );
};

const likeSauce = (req, res) => { //creation de la const likeSauce pour avoir un systeme de like et dislike

  if (req.body.like === 1) { // si l'utilisateur met un like
    Sauce.findOneAndUpdate(
      {_id: req.params.id},
      {
        $inc: {likes: 1},
        $push: {usersLiked: req.body.userId}
      })
      .then(() => res.status(200).json({ message: '1 like en plus !' }))
      .catch(error => res.status(400).json({ error }))
  } else if (req.body.like === -1) { // si l'utilisateur met un dislike
    Sauce.findOneAndUpdate(
      {_id: req.params.id},
      {
        $inc: {dislikes: 1},
        $push: {usersDisliked: req.body.userId}
      })
      .then(() => res.status(200).json({ message: '1 dislike en plus !' }))
      .catch(error => res.status(400).json({ error }))
  } else { // si l'utilisateur enleve son like
    Sauce.findOne({_id: req.params.id})
      .then(resultat => {
        if (resultat.usersLiked.includes(req.body.userId)) {
          Sauce.findOneAndUpdate(
            {_id: req.params.id},
            {
              $inc: {likes: -1},
              $pull: {usersLiked: req.body.userId}
            })
            .then(() => res.status(200).json({ message: '1 like en moins !' }))
            .catch(error => res.status(400).json({ error }))
        }
        else if (resultat.usersDisliked.includes(req.body.userId)) { // si l'utilisateur enleve son dislike
          Sauce.findOneAndUpdate(
            { _id: req.params.id },
            {
              $inc: {dislikes: -1},
              $pull: {usersDisliked: req.body.userId}
            })
            .then(() => res.status(200).json({ message: '1 dislike en moins !' }))
            .catch(error => res.status(400).json({ error }))
        }
      })
    }
}

//j'exporte mes const pour pouvoir les utiliser par la suite
module.exports={createSauce, getOneSauce, modifySauce, deleteSauce, getAllStuff, likeSauce};
