'use strict';
var db = require('./connexion.js').db;

var User = db.define('users',{
    login : {type:'text'},
    password : String,
    role : ['professeur', 'etudiant']
});
User.sync(function(err) {
    if (!err)
            console.log("Done!");
        else
            console.log(err);
});

exports.User = User;