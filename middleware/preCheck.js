const UserLogin =require("../model/authentication");
const Matiere =require("../model/matiere");
checkDuplicateIdentifier = (req, res, next) => {
  UserLogin.findOne({
    identifiant: req.body.identifiant
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      res.status(400).send({ message: "Echec! Identifiant existant" });
      return;
    }
    next();
  });
};

checkDuplicateMatiere = (req, res, next) => {
  Matiere.findOne({
    nom: req.body.identifiant
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      res.status(400).send({ message: "Echec! Matiere deja existant" });
      return;
    }
    next();
  });
};

const preCheck = {
    checkDuplicateIdentifier, 
    checkDuplicateMatiere
};
module.exports = preCheck;