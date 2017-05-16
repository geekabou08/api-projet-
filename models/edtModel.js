'use strict';
var db = require('./connexion.js').db;
var Cours = require('./coursModel.js').Cours;
var Classe = require('./classeModel.js').Classe;


var EDT=db.define('emploi du temps',{
    jour:['lundi','mardi','mercredi','jeudi','vendredi','samedi'],
    heure:['8h-10h','10h-12h','14h30-16h30','16h30-18h30'],
});
EDT.hasOne('cours',Cours);
EDT.hasOne('classe',Classe);

EDT.sync(function(err) {
    if (!err)
        console.log("Done!");
    else
        console.log(err);
});

exports.EDT=EDT;