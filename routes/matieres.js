let mongoose = require('mongoose');
let Matiere = require('../model/matiere');
let User = require('../model/user');
let Assignment = require('../model/assignment');

// Récupérer toutes les matierss (GET)

function getMatieres(req, res) {
    var aggregateQuery = Matiere.aggregate();
    let populate = [];
    if (req.headers.detailed == "true") {
        populate = [{ path: 'docs.prof', model: User }, { path: 'docs.etudiants', model: User }];
    }
    Matiere.aggregatePaginate(aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        },
        (err, matieres) => {
            if (err) {
                res.send(err);
            }

            Matiere.populate(matieres, populate).then(function (error, mm) {
                if (error) res.json(error);
                res.json(mm);
            });
        }
    );
}

function getMatieresByProf(req, res) {
    var aggregateQuery = Matiere.aggregate([{ $match: { prof: mongoose.Types.ObjectId(req.params.id) } }]);
    let populate = [];
    if (req.headers.detailed == "true") {
        populate = [{ path: 'docs.prof', model: User }];
    }
    Matiere.aggregatePaginate(aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        },
        (err, matieres) => {
            if (err) {
                res.send(err);
            }
            console.log(matieres);
            Matiere.populate(matieres, populate).then(function (error, mm) {
                if (error) res.json(error);
                res.json(mm);
            });
        }
    );
}

// Récupérer une matiere par son id (GET)
function getMatiere(req, res) {
    let matiereId = req.params.id;
    let populate = [];
    if (req.headers.detailed == "true") {
        populate = [{ path: 'prof', model: User }, { path: 'etudiants', model: User }];
    }

    Matiere.findOne({ _id: matiereId }).populate(populate)
        .then(function (err, matiere) {
            if (err) res.json(err);
            res.json(matiere);
        });
}

function postMatiere(req, res) {
    let matiere = new Matiere();
    matiere.nom = req.body.nom;
    matiere.prof = req.body.profId;
    matiere.etudiants = req.body.etudiantIds;

    matiere.save((err) => {
        if (err) {
            res.send('cant post matiere ', err);
        }
        res.json({ message: `Matière ${matiere.nom} enregistré!`, result: matiere })
    })
}
function updateMatiere(req, res) {
    console.log("UPDATE recu utilisateur : ");
    console.log(req.body);
    Matiere.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, matiere) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.json({ message: `${matiere.nom} mis à jour!`, result: matiere })
        }
    });
}

function subscribeMatiereByEtudiant(req, res) {
    let userId = req.body.etudiantId;
    let matiereId = req.body.matiereId;
    User.findOne({ _id: userId }, (err, user) => {
        if (err) { res.send(err) }
        if (user && user.type == "Etudiant") {
            Matiere.findOne({ _id: matiereId }).exec(function (err, matiere) {
                if (err) { res.send(err) }
                if (matiere) {
                    let etudiants = matiere.etudiants;
                    if (!etudiants.includes(userId)) {
                        etudiants.push(userId);
                    }
                    console.log(etudiants);
                    Matiere.findByIdAndUpdate(matiereId, { etudiants: etudiants });
                } else {
                    res.status(404).json({ message: "matiere not found" });
                }
            });
            res.json(user);
        } else {
            res.status(404).json({ message: "user not found or is not an etudiant" });
        }
    });
}



module.exports = { getMatieres, postMatiere, updateMatiere, getMatiere, getMatieresByProf, subscribeMatiereByEtudiant };
