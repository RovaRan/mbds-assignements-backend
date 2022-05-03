let User = require('../model/user');
let Authentication = require('../model/authentication');

function getUsers(req, res) {
    var aggregateQuery = User.aggregate();
    User.aggregatePaginate(aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        },
        (err, users) => {
            if (err) {
                res.send(err);
            }
            res.send(users);
        }
    );
}

function getUser(req, res) {
    let userId = req.params.id;

    User.findOne({ _id: userId }, (err, user) => {
        if (err) { res.send(err) }
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "user not found" });
        }
    });
}

// Ajout d'un utilisateur (POST)
function postUser(req, res) {
    let user = new User();
    user.nom = req.body.nom;
    user.photoUrl = req.body.photoUrl;
    user.type = req.body.type;

    console.log("POST user reçu :");
    console.log(user)

    user.save((err) => {
        if (err) {
            res.send('cant post user ', err);
        }
        res.json({ message: `${user.nom} saved depuis la version HEROKU!`, result: user })
    })
}

// Update d'un utilisation (PUT)
function updateUser(req, res) {
    console.log("UPDATE recu utilisateur : ");
    console.log(req.body);
    User.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, user) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            if (user) {
                res.json({ message: `${user.nom} mis à jour!`, result: user });
            } else {
                res.status(404).json({ message: "user not found" });
            }
        }
    });
}

// suppression d'un utilisateur (DELETE)
function deleteUser(req, res) {

    User.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.send(err);
        }
        if (user) {
            res.json({ message: `${user.nom} deleted` });
        } else {
            res.status(404).json({ message: "user not found" });
        }
    })
}

function createUserFullProfil(req, res) {
    let user = new User();
    user.nom = req.body.nom;
    user.photoUrl = req.body.photoUrl;
    user.type = req.body.type;

    user.save((err) => {
        if (err) {
            res.send('cant post user ', err);
        }
        let login = new Authentication();
        login.user = user._id;
        login.identifiant = req.body.identifiant;
        login.motDePasse = req.body.motDePasse;

        login.save((err) => {
            if (err) {
                res.send('cant post user ', err);
            }
            let result = {
                _id: login._id,
                identifiant: login.identifiant,
                user: user
            }
            res.json({ message: `${login.identifiant} saved depuis la version HEROKU!`, result: result })
        });
    });
}

module.exports = { getUsers, postUser, getUser, updateUser, deleteUser, createUserFullProfil };
