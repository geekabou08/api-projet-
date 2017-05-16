'use strict';

var db = require('./connexion.js').db;
var Cours = require('./coursModel.js').Cours;
var Classe = require('./classeModel').Classe;

//Definition de la table
var CDT= db.define('cahier de texte',{
    horaire : String,
    date: Date,
    valide:Boolean,
    activite: {type:'text'}
});
CDT.hasOne('cours',Cours);
CDT.hasOne('classe',Classe);

CDT.sync(function(err) {
    if (!err)
        console.log("Done!");
    else
        console.log(err);
});
exports.CDT=CDT;