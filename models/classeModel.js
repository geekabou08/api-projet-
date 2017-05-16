'use strict';
var db = require('./connexion.js').db;

var Classe =  db.define('classes', {
    nom : String,
    responsable_id:String,
    pesponsable_peda_id:String
});
Classe.sync(function (err) {
    if (!err)
        console.log("Done! prof");
    else
        console.log(err);
});

exports.Classe =  Classe ;