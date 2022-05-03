let Assignment = require('../model/assignment');
let Matiere = require('../model/matiere');

function getAssignments(req, res) {
    
    var aggregateQuery = Assignment.aggregate();
    Assignment.aggregatePaginate(aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        },
        (err, assignments) => {
            if (err) {
                res.send(err);
            }
            res.send(assignments);
        }
    );
}


function getAssignment(req, res) {
    let assignmentId = req.params.id;

    Assignment.findOne({ _id: assignmentId }, (err, assignment) => {
        if (err) { res.send(err) }
        res.json(assignment);
    })
}

function postAssignment(req, res) {
    let assignment = new Assignment();
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    assignment.save((err) => {
        if (err) {
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved depuis la version HEROKU!` })
    })
}

function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.json({ message: `${assignment.nom} updated!` })
        }
    });

}

function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: `${assignment.nom} deleted` });
    })
}

function getAssignmentsByStudentId(req, res) {

}

function createAssignmentFromMatiereId(req, res) {
    let matiereId = req.params.id;

    Matiere.findOne({ _id: matiereId }, (err, matiere) => {
        if (err) { res.send(err) }
        let studentIds = matiere.etudiants;
        let assignments = [];
        studentIds.forEach(function (studentId) {
            let assignment = new Assignment();
            assignment.nom = matiere.nom;
            assignment.dateDeRendu = new Date(req.body.dateDeRendu).toISOString();
            assignment.rendu = false;
            assignment.etudiant = studentId;
            assignment.matiere = matiere._id;
            assignment.save();
            assignments.push(assignment);
        });

        res.json({ "message": "Success", result: assignments });
    })
}

module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment, createAssignmentFromMatiereId };
