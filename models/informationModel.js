'use strict';

var db = require('./connexion.js').db;
//Creation de la table infos dans la base de données dans la base de données

var Infos = db.define('infos', {
    //fichier  : Buffer,
    titre : String,
    contenu : {type: 'text'},
    date_publication : Date,
    portee : String,
    id_publicateur: String,
    nom_publicateur:String,
    prenom_publicateur:String
});
Infos.sync(function (err) {
    if (!err)
        console.log("Done!");
    else
        console.log(err);
});

exports.Infos = Infos;