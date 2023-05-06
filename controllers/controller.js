const UserDAO = require('../models/userModel')
const articleDAO = require('../models/articleModel')
const articleList = new articleDAO();
articleList.init();
const GoalsDAO = require('../models/goalsModel');
const {validationResult}=require('express-validator');
const fs = require("fs");


exports.profile = (req,res) => {
    let user = req.params.user;
    GoalsDAO.getUserGoals(user, true).then(
        (goal_list) => {
            res.render('profil', {
                'user': user,
                'nutrition': goal_list.nutrition,
                'fitness': goal_list.fitness,
                'lifestyle': goal_list.lifestyle
            });
        });
}

exports.render_add = (req,res) => {
    res.render('newGoal', {
        'user': req.params.user
    })
}

exports.new_goal= (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('newGoal',{
            'errors': errors.array(),
            'user': req.params.user
        });
    }
    

    GoalsDAO.addGoal(req.params.user, req.body.category, req.body.description);
    res.locals.notif = {type: "success", msg: "Your goal have been successfully added"};
    res.redirect("/profile/"+req.params.user);

}

exports.delete = (req,res) => {

    GoalsDAO.getGoal(req.params.id).then(
        (goal) =>{
            if(!goal) {
                return res.status(404).send('404 - Not found');
            }

            if(goal[0].author == res.locals.user){
                GoalsDAO.remove(req.params.id);
                res.redirect("/profile/"+req.body.user);
            }else{
                res.status(401).send('401 - You are not authorized to access this resource');
            }
            
        }  
    )

   

}

exports.validate = (req,res) => {

    GoalsDAO.getGoal(req.params.id).then(
        (goal) =>{
            if(!goal) {
                return res.status(404).send('404 - Not found');
            }

            if(goal[0].author == res.locals.user){
                GoalsDAO.achieve(req.params.id);
                res.redirect("/profile/"+req.body.user);
            }else{
                res.status(401).send('401 - You are not authorized to access this resource');
            }
            
        }  
    )
    

}

exports.history_render = (req,res) => {

    let user = req.params.user;
    GoalsDAO.getUserGoals(user, false).then(
        (goal_list) => {
            res.render('history', {
                'user': user,
                'nutrition': goal_list.nutrition,
                'fitness': goal_list.fitness,
                'lifestyle': goal_list.lifestyle
            });
        })

}

exports.BMI_render = (req,res) => {

    res.render('BMI',{'user': res.locals.user});

}

exports.calculator = (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('BMI',{
            'errors': errors.array(),
            'user': res.locals.user
        });
    }

    let BMI = (req.body.weight/(req.body.height**2)).toFixed(1);
    let advise;
    let color;

    if(BMI<=24.9 && BMI>=18.5) {
        advise = "For an adult, this BMI is normal. You should be in good shape !";
        color = "green";
    }else{
        advise = "For an adult, this BMI is abnormal and may result in health problems";
        color = "red";
    }

    res.render('result', {
        'BMI': BMI,
        'user': res.locals.user,
        'advise': advise,
        'color': color
    })
}

exports.showCategory = (req,res) => {

    articleList.getByCategory(req.params.category).then(
        (article_list) => {
            res.render('articleList', {
                'Articles': article_list,
                'user': res.locals.user
            })
        }
    )
}

exports.showArticles = (req,res) => {

    articleList.getByTitle().then(
        (article_list) => {
            res.render('articleList', {
                'user': res.locals.user,
                'Articles': article_list
            })
        }
    )

}

exports.searchArticles = (req,res) => {

    articleList.getByTitle(req.body.searchBar).then(
        (article_list) => {
            
            res.render('articleList', {
                'user': res.locals.user,
                'Articles': article_list
            })
        }
    )

}

exports.renderArticle = (req,res) => {

    articleList.getArticle(req.params.id).then(
        (article) => {
            console.log(article);
            fs.readFile(__dirname + "/../public" + article[0].content, (err,txt) => {
                if(err){
                    res.render('article', {'user': res.locals.user})
                }else{
                    res.render('article', {
                        'user': res.locals.user,
                        'Article': {
                            'title': article[0].title,
                            'illustration': article[0].illustration,
                            'content': txt
                        }
                    })
                }
                
            })
        }
    )

}

exports.render_register = (req,res) => {

    res.render('register');

}

exports.new_user = (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('register',{
            'errors': errors.array()
        });
    }else{
        const user = req.body.username;
        const password = req.body.password;

        if(!user || !password){
            res.send(401,"No user or password");
            return;
        }else{
            UserDAO.search(user, (err,hit)=>{
                
                if (hit) {
                    res.status(401).render('register',{
                        'errors': [{msg: "Username already used" }]
                    });
                    return;
                }
                UserDAO.add(user, password);
                console.log("user added");
                res.redirect('/login');
            })
        }
    }

   
}

exports.render_login = (req,res) => {

    res.render('login');

}

exports.post_login = (req,res) => {
    let user = res.locals.user;
    res.redirect("/profile/" + user);
}

exports.update_render = (req,res) => {

    GoalsDAO.getGoal(req.params.id).then(
        (goal) =>{
            if(!goal) {
                return res.status(404).send("404 - Not found");
            }

            if(goal[0].author == res.locals.user){
                res.render('update', {'user': res.locals.user, 'old':goal[0].description});
            }else{
                res.status(401).send("401 - You are not authorized to access this resource");
            }
            
        }  
    )
    
}

exports.update_goal = (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('update',{
            'errors': errors.array(),
            'user': res.locals.user
        });
    }


    GoalsDAO.getGoal(req.params.id).then(
        (goal) =>{
            if(!goal) {
                return res.status(401).send();
            }

            if(goal[0].author == res.locals.user){
                GoalsDAO.modify(req.params.id,req.body.description);
                res.redirect("/profile/" + res.locals.user)
            }else{
                res.status(401).send("401 - You are not authorized to access this resource");
            }
            
        }  
    )

}

exports.logout = (req,res) => {
    res.clearCookie("ticket").status(200).redirect("/");
}
