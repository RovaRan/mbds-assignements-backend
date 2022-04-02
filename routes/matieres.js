let Matiere = require('../model/matiere');

// Récupérer tous les assignments (GET)
function getMatieres(req, res){
    Matiere.find((err, matieres) => {
        if(err){
            res.send(err)
        }

        res.send(matieres);
    });
}

// Récupérer un assignment par son id (GET)
function getMatiere(req, res){
    let assignmentId = req.params.id;

    Matiere.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postMatiere(req, res){
    let assignment = new Matiere();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!`})
    })
}

// Update d'un assignment (PUT)
function updateMatiere(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Matiere.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: `${assignment.nom} updated!`})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteMatiere(req, res) {

    Matiere.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}

function showText(req, res) {

    res.json(' showText function has been called x ! ')
}

module.exports = { getMatieres, postMatiere, getMatiere, updateMatiere, deleteMatiere, showText};
