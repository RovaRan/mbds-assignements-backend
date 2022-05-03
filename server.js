let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');
let mongoose = require('mongoose');
let user = require('./routes/user');
let matiere = require('./routes/matieres');
let authentication = require('./routes/authentication');
let { authJwt } = require('./middleware');
let { preCheck } = require('./middleware');


mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
const uri = 'mongodb+srv://iaina:1234@cluster0.xmwol.mongodb.net/assignments?retryWrites=true&w=majority';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
  },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "detailed, x-access-token,Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

app.route(prefix + '/assignments')
  .get([authJwt.verifyToken], assignment.getAssignments)
  .post([authJwt.verifyToken], assignment.postAssignment)
  .put([authJwt.verifyToken], assignment.updateAssignment);

app.route(prefix + '/assignments/:id')
  .get([authJwt.verifyToken], assignment.getAssignment)
  .delete([authJwt.verifyToken, authJwt.isAdmin], assignment.deleteAssignment);

app.route(prefix + '/users')
  .get([authJwt.verifyToken], user.getUsers)
  .post([authJwt.verifyToken, authJwt.isAdmin], user.postUser)
  .put([authJwt.verifyToken], user.updateUser);

app.route(prefix + '/users/:id')
  .get([authJwt.verifyToken], user.getUser)
  .delete([authJwt.verifyToken, authJwt.isAdmin], user.deleteUser);

app.route(prefix + '/user/authenticate')
  .post(authentication.authentication);

app.route(prefix + '/user/create-login/:id')
  .post([authJwt.verifyToken, authJwt.isAdmin, preCheck.checkDuplicateIdentifier], authentication.createLogin);


app.route(prefix + '/matieres')
  .get([authJwt.verifyToken], matiere.getMatieres)
  .post([authJwt.verifyToken, authJwt.isAdmin,preCheck.checkDuplicateMatiere], matiere.postMatiere)
  .put([authJwt.verifyToken, authJwt.isAdmin], matiere.updateMatiere);

app.route(prefix + '/matieres/:id')
  .get([authJwt.verifyToken], matiere.getMatiere)


app.route(prefix + '/user/:id/matieres')
  .get([authJwt.verifyToken], matiere.getMatieresByProf)

app.route(prefix + '/user/souscrire-matieres')
  .post([authJwt.verifyToken], matiere.subscribeMatiereByEtudiant)

app.route(prefix + '/matiere/:id/create-assignments')
  .post([authJwt.verifyToken, authJwt.isAdmin], assignment.createAssignmentFromMatiereId)

app.route(prefix + '/user/full-profil')
  .post([authJwt.verifyToken, authJwt.isAdmin, preCheck.checkDuplicateIdentifier], user.createUserFullProfil)

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


