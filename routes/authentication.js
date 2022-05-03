let Authentication = require('../model/authentication');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
let User = require('../model/user');


function createLogin(req, res) {
    let login = new Authentication();
    login.user = req.params.id;
    login.identifiant = req.body.identifiant;
    login.motDePasse = req.body.motDePasse;
    login.derniereConnexion = req.body.derniereConnexion;

    Authentication.findOne({ identifiant: userName }, (err, user) => {
        if (err) { res.send(err) }
        else {
            if (user) {
                res.json({ message: `identifiant existant` })
            } else {
                login.save((err) => {
                    if (err) {
                        res.send('cant post user ', err);
                    }
                    res.json({ message: `${login.nom} a été enregistré!`, result: login })
                });
            }
        }
    })
}

function updateLogin(req, res) {
    console.log("UPDATE recu utilisateur : ");
    console.log(req.body);
    Authentication.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, user) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.json({ message: `${user.nom} updated!` })
        }
    });

}

function deleteLogin(req, res) {

    Authentication.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: `${user.nom} deleted` });
    })
}

function authentication(req, res) {
    let userName = req.body.identifiant;
    let userPassword = req.body.motDePasse;

    Authentication.findOne({ identifiant: userName, motDePasse: userPassword }).select("-motDePasse").populate({ path: 'user', model: User }).then(
        function (mm) {
            if (mm) {
                updateUserLastConnectionToDateNow(mm);
                let response={
                    id:mm._id,
                    identifiant:mm.identifiant,
                    user:mm.user,
                    derniereConnexion:mm.derniereConnexion,
                    accessToken:jwt.sign({id:mm._id},config.secret,{expiresIn:3600})
                }
            
                res.json(response);
            }else{
                res.json({"message":"authentication failed"});
            }
        }
    );
}

function updateUserLastConnectionToDateNow(usr) {
    console.log(usr);
    usr.derniereConnexion = Date.now();


    Authentication.findByIdAndUpdate(usr._id, usr, { new: true }, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            console.log({ message: `${user.identifiant} logged!` })
        }
    })
}

module.exports = { createLogin, updateLogin, deleteLogin, authentication };
