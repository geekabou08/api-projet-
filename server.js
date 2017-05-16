'use strict' ;
/*
Inclusion des module de gestion de la base de données
*/
var express = require('express');
var bodyParser = require('body-parser');
var sha1 = require('sha1');
var app = express();

// Activation du body parser pour recuperer les requetes POST from the forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Relier les modeles
var Prof = require('./models/professeurModel.js').Prof;
var Etudiant = require('./models/etudiantModel.js').Etudiant;
var Cours = require('./models/coursModel.js').Cours;
var User = require('./models/userModel.js').User;
var Absence = require('./models/absenceModel.js').Absence;
var Info = require('./models/informationModel.js').Infos;
var Classe = require('./models/classeModel.js').Classe;
var EDT = require('./models/edtModel.js').EDT; //emploi du temps
var CDT = require('./models/cahierdetexteModel.js').CDT; //cahier de texte



//Recupation de l'ensemble des utilisateurs du systemes
app.get('/users',function (req,resp){
    // on renvoie l'ensemble des users au format Json
    User.find(function (err,users) {
        if(err){
            // Il y'a une erreur on fait une 404
            console.log("erreur dans la recuperaion des users");
        }else{
            // les users sont recuperés et se trouvent dans la variable users
            resp.json(users);
        }
    });
});

//recuperer un etudiant ou professeur via son id
app.get('/user/:id',function (req,resp){
    var id = req.params.id;
    User.get(id,function (err,user){
       if (err){
            resp.json({'status':"echec",'message':"Utilisateur inexistant"});
       }
        else{
           if(user.role=="etudiant"){
               Etudiant.find({login:user.login},function (err,etu) {
                   if(err) throw err;
                   resp.json({'status':"succes",'data':etu[0]})
               });
           }else{
               Etudiant.find({login:user.login},function (err,prof) {
                   if(err) throw err;
                   resp.json({'status':"succes",'data':prof[0]})
               });
           }
       }
    });
});

//Ajout d'un professeur
app.post('/professeur',function (req,resp) {
    var prof ={
        nom : req.body.nom,
        prenom :req.body.prenom,
        email : req.body.email,
        login : req.body.login,
        resp_peda : req.body.resp_pedago
    };
    var user ={
        login : req.body.login,
        password :req.body.password,
        role : 'professeur'
    };
    User.exists({login : user.login},function (err,exist) {
        if(err){
            console.log('ERROR!!!');
        }
        else {
                if(exist){
                    resp.json({'status': "echec",'message' : "Ce login existe dejà!"});
                }
                else{
                    Prof.create(prof,function (err,prof) {
                        if(err){
                            //handle one error
                            resp.json({'status': "echec", 'message': "Erreur ajout dans la table professeurs"});

                        } else{
                            User.create(user,function (err,user) {
                                if(err){
                                    //handle one error
                                    resp.json({'status': "echec", 'message': "Erreur ajout dans la table users"});
                                } else{
                                    resp.json({'status':"succes",'message': "Enregistrement reussi!",user: user, prof: prof});
                                }
                            });

                        }
                    });
                }
            }
    });
});

//Ajout d'un étudiant
app.post('/etudiant',function (req,resp){
    var etudiant ={
        nom : req.body.nom,
        prenom :req.body.prenom,
        email : req.body.email,
        login : req.body.login,
        classe : req.body.classe,
        responsable : req.body.responsable
        //heure_absence :0
    };
    var user ={
        login : req.body.login,
        password :req.body.password,
        role : 'etudiant'
    };
    User.exists({login : user.login},function (err,exist) {
        if(err){
        }
        else {
            if (exist) {
                resp.json({'status': "echec", 'message': "Ce login existe dejà!"});
            }
            else {
                User.create(user, function (err, user) {
                    if (err) {
                        //handle one error
                        resp.json({'status': "echec", 'message': "Erreur ajout dans la table users"});
                    }
                    else {
                        Etudiant.create(etudiant, function (err, etudiant) {
                            if (err) {
                                //handle one error
                                resp.json({'status': "echec", 'message': "Erreur ajout dans la table etudiants"});
                            }
                            else {
                                resp.json({'status':"succes",'message':"Enregistrement reussi!",user: user, etudiant: etudiant});
                            }
                        });

                    }
                });
            }
        }
    });
});

//Recuperer un prof specifique
app.get('/professeur/:id',function (req,resp) {
    var id = req.params.id;
    Prof.get(id,function (err,prof) {
        if(err){
            // handle one error  !! Unknown user
            console.log("utlisateur inexistant");
        }else{
            resp.json(prof);
                }
            });
        });

//recuperer un etudiant specifique
app.get('/etudiant/:id',function (req,resp) {
    var id = req.params.id;
    Etudiant.get(id,function (err,etudiant) {
        if(err){
            resp.json({'status':"echec",'message':"utlisateur inexistant"});
        }else{
                resp.json({'status':"succes",'etudiant':etudiant});
        }
    });
});

//Ajout d'un cours
app.post('/cours',function (req,resp) {
    var nom_cours = req.body.nom;
    var niveau = req.body.niveau;
    var nom_prof = req.body.nom_prof;
    var prenom_prof = req.body.prenom_prof;
    Prof.find({nom: nom_prof,prenom: prenom_prof},function (err,prof) {
        if (err) throw err;
        if(prof.length==0){
            resp.json({'status':"echec", 'message':"Ce professeur n'est pas sur la base de donnée."});
        }
        else{
            var prof_id = prof[0].id;
            var cours ={
                nom: nom_cours,
                niveau: niveau,
                professeur_id : prof_id
            };
            console.log(cours);
            Cours.create(cours,function (err,cours){
                    if (err) {
                        //handle one error
                        resp.json({'status': "echec", 'message': "Erreur ajout dans la table cours"});
                    }
                    else {
                        resp.json({'status':"succes",'message':"Enregistrement reussi!", cours: cours});
                    }
            });
        }
    });

});
///Recuperation des cours cours
app.get('/cours',function (req,resp) {
    Cours.find(function (err,cours) {
        if(err){
            resp.json({'status':"echec",'message': "Erreur"});
            throw err;
        }
        else{
            resp.json({'status':"succes",'data':cours});
        }
    })
});

app.post('/absence',function(req,resp){
    var nom_etu = req.body.nom_etu;
    var prenom_etu = req.body.prenom_etu;
    var classe_etu = req.body.classe_etu;
    var nom_cours = req.body.nom_cours;
    var date_abs = new Date();
    Etudiant.find({nom:nom_etu,prenom:prenom_etu,classe:classe_etu},function (err,etudiants){
        if (err) throw err;
        if(etudiants.length==0){
            resp.json({'status':"echec", 'message':"Cet etudiant n'existe pas sur la base de donnée."});
        }
        else if (etudiants.length==1){
            var etudiant_id = etudiants[0].id;
            Cours.find({nom:nom_cours},function (err,cours) {
                if(err) throw err;
                if (cours.length==0){
                    resp.json({'status':"echec", 'message':"Ce cours n'existe pas!"});
                }
                else{
                    var id_cours=cours[0].id;
                    var absence= {
                        etudiant_id : etudiant_id,
                        date : date_abs,
                        cours_id : id_cours
                    }
                    Absence.create(absence,function (err,abs) {
                        if (err) {
                            //handle one error
                            resp.json({'status': "echec", 'message': "Erreur ajout dans la table absence"});
                        }
                        else {
                            //Augmenter le nombre d'heures d'absences de l'etudiant
                            Etudiant.get(absence.etudiant_id,function(err,etu){
                                etu.heure_absence=etu.heure_absence+2;
                                etu.save(function(err){
                                    if(!err)
                                        resp.json({'status':"succes",'message':"Enregistrement reussi!", absence: abs});
                                });
                            });
                        }
                    });
                }
            });
        }
    })
});
//Recuperer les absences
app.get('/absences',function (req,resp){
    // on renvoie l'ensemble des users au format Json
    Absence.find(function (err,absences) {
        if(err){
            // Il y'a une erreur on fait une 404
            resp.json({'status':"echec",'message':"Erreur recuperation d'absences"});
        }else{
            // les users sont recuperés et se trouvent dans la variable absences
            resp.json(absences);
        }
    });
});
//Verfication user
app.post('/connexion',function (req,resp){
    var login = req.body.login;
    var passsword = req.body.password;
    var statut =req.body.statut;
    User.find({login:login, password: passsword, role:statut},function (err,users){
        if(err) throw err;
        if (users.length==0){
            resp.json({'status':"echec",'message':"Utilisateur inexistant!"});
        }
        else{
            if (statut=="etudiant"){
                Etudiant.find({login:login},function (err,etudiant){
                    if(err) throw err;
                     var user =etudiant[0];
                    resp.json({'status':"succes",'user':user,'idLogin':users[0].id});

                })
            }
            else{
                Prof.find({login:login},function (err,prof){
                    if(err) throw err;
                    var user =prof[0];
                    Cours.find({professeur_id:user.id},function (err,cours) {
                        if(err) throw err;
                        resp.json({'status':"succes",'user':user,'cours':cours,'idLogin':users[0].id});
                    })
                })
            }
        }
    });
});
//Obtenir la liste d'une classe
app.get('/classe/:nom',function (req,resp) {
    var nom_classe=req.params.nom;
    Etudiant.find({classe:nom_classe},function (err,liste) {
       if(err) throw err;
       resp.json({'status':'succes','liste':liste});
    });
});

//Poster une information
app.post('/publication',function(req,resp){
    var titre = req.body.titre;
    var contenu = req.body.contenu;
    var id_publicateur =req.body.id_publicateur;
    var nom_publicateur= req.body.nom_publicateur;
    var prenom_publicateur=req.body.prenom_publicateur;
    var portee = req.body.portee;
    var date = new Date();
    var post ={
        titre : titre,
        contenu: contenu,
        id_publicateur : id_publicateur,
        portee: portee,
        date_publication: date,
        nom_publicateur : nom_publicateur,
        prenom_publicateur:prenom_publicateur
    };
    Info.create(post,function(err,post){
        if(err){
            //handle one error
            resp.json({'status':"echec",'message':"Impossible d'ajouter ce post sur la base de données"});
        } else{
            resp.json({'status':"succes",'message':"Information postée avec succes",'post':post});
        }
    });
});

//Recuperer les poste de la base de données
app.get('/posts',function (req,resp) {
    Info.find(function(err,posts){
        if(err) throw err;
        resp.json({'status':"succes",'posts':posts});
    });
});

//Recuperer un prof specifique
app.get('/post/:id',function (req,resp) {
    var id = req.params.id;
    Info.get(id,function (err,post) {
        if(err){
            // handle one error  !! 
            resp.json({'status':"echec",'message':"post inexistant"});
        }else{
            resp.json({'status':'succes','post':post});
                }
            });
        });

//Ajouter une table emploi du temps
app.post('/edt',function (req,resp){
    Cours.find({nom:req.body.nom_cours},function (err,cours){
        if(err) throw err;
        else{
            var id_cours=cours[0].id;
            Classe.find({nom:req.body.nom_classe},function(err,classe){
                if(err) throw err;
                else{
                    var id_classe=classe[0].id;
                    var edt={
                        jour : req.body.jour,
                        heure: req.body.heure,
                        cours_id:id_cours,
                        classe_id:id_classe
                    };
                    EDT.create(edt,function(err,edt){
                        if(err){
                            resp.json({'status':"echec",'mesage':"Impossible d'ecrire sur la table"});
                        }else{
                            resp.json({'status':"succes",'message':"Enregistrement fait avec succes"});
                        }
                    });
                }
            });
        }
    })

});

//Recuperer une classe par son ID
app.get('/classe/infos/:id',function (req,resp) {
    Classe.get(req.params.id,function(err,classe){
        if(err) throw err;
        else resp.json({"status":'succes','classe':classe});
    })
});


//Recuperer emploir du temps classe
app.get('/edt/:classe',function (req,resp){
    Classe.find({nom:req.params.classe},function (err,classes) {
        if(err){
            resp.json({'status':"echec",'message':" Impossible de trouver la classe."});

        }else{
            if(classes.length===0){
                resp.json({'status':"echec",'message':" Impossible de trouver la classe."});
            }else{
                EDT.find({classe_id:classes[0].id},function (err,edt){
                    if(err){
                        resp.json();
                    }else{
                        resp.json({'status':'succes',data:edt})
                    }
                })
            }
        }
    });
});


//Enregistrement dans la table cahier de texte
app.post('/cahierdetexte',function(req,resp){
    var date= new Date();
        var cdt ={
            horaire:req.body.horaire,
            date:date,
            classe_id: req.body.id_classe,
            cours_id:req.body.id_cours,
            valide:false,
            activite:req.body.activite
        };
        CDT.create(cdt,function (err) {
            if(err){
                console.log("Erreur ecriture sur la table CDT")
            }else{
                resp.json({'status':'succes','message':"Enregistrement fait avec succès!!!"})
            }
        });

});
//Recuperer les donnees du cahier de texte
app.get('/cahierdetexte/cours/:id',function (req,resp){
    var id_cours=req.params.id;
    CDT.find({cours_id:id_cours},function (err,data){
        if(err){
            throw err;
            resp.json({'status':"echec",'message':""});
        }
        else{
            resp.json({'status':"succes",'data':data});
        }
    })
});
//Modifier champ valide du cahier de texte
app.get('/cahierdetexte/valid/:id',function (req,resp) {

    CDT.get(req.params.id,function (err,reponse){
       if (err) throw err;
       else{
           reponse.valide=true;
           reponse.save(function (err) {
               resp.json({'status':"succes",'message':"Activité validée avec succes"});
           })
       }
    });
});

//Recuperer une activité
app.get('/cahierdetexte/activite/:id',function (req,resp) {
    CDT.get(req.params.id,function (err,activite) {
       if(err) throw err;
       else
           resp.json({'status':"succes",'activite':activite});
    });
});
//Lancer le serveur sur le port 3000
app.listen(3000);