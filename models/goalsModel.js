const Datastore = require('nedb');

class Goals{
    constructor(dbFilePath) {
        if(dbFilePath){

            this.db = new Datastore({ filename: dbFilePath, autoload: true});

        }else{

            this.db = new Datastore();

        }
    }

    init() {
        this.db.insert({
            author: "Peter",
            category: 'Fitness',
            description: "Perform two 6x200m once a week for 2 mounths",
            achieved: false
        });

        this.db.insert({
            author: "Peter",
            category: 'Lifestyle',
            description: "Stop using screens after 10 p.m",
            achieved: false
        });

        this.db.insert({
            author: "Ann",
            category: 'Lifestyle',
            description: "Spend 1 hour to walk around the park",
            achieved: false
        });

        this.db.insert({
            author: "Ann",
            category: 'Nutrition',
            description: "Eat 5 fruits and vegetables each day",
            achieved: false
        });

        console.log("Goals initialized")

    }

    getGoal(id) {
        return new Promise((resolve, reject) => {
            this.db.find({'_id': id}, function(err, doc) {
                if(err){
                    reject(err);
                }else{
                    resolve(doc)
                }
            })
        })
    }

    getUserGoals(username, active) {
        return new Promise((resolve, reject) => {
            this.db.find({'author': username, achieved: !active}, function(err, group) {
                if(err){
                    reject(err);
                }else{

                    let nut = [];
                    let fit = [];
                    let life = [];

                    for (let i = 0; i < group.length; i++) {
                        switch(group[i].category) {
                            case 'Nutrition': 
                                nut.push(group[i]);
                                break;
                            case 'Fitness':
                                fit.push(group[i]);
                                break;
                            case 'Lifestyle':
                                life.push(group[i]);
                                break;
                            default:
                                console.log("issue while sorting a goal.");
                        }
                    }

                    let goal_list = {
                        nutrition: nut,
                        fitness: fit,
                        lifestyle: life
                    }


                    resolve(goal_list);

                }


            });
        });
    }

    addGoal(author, category, description) {

        var goal = {
            author: author,
            category: category,
            description: description,
            achieved: false
        }

        this.db.insert(goal, (err, output) =>{
            if(err){
                console.log("Error while inserting in the database");
            }else{
                console.log("A new goal has been inserted in the database");
            }
        })
    }

    remove(id) {

      

        this.db.remove({_id: id}, {}, (err, del) => {
            if(err){
                console.log("Unable to delete");
            }else{
                console.log("This entry was removed");
            }
        })

    }

    achieve(id) {

        this.db.update({_id: id}, {$set: {achieved: true, achieved_date: new Date().toISOString().split('T')[0]}},{}, (err, doc) => {
            if(err){
                console.log("Unable to validate the goal");
            }else{
                console.log("This goal is now achieved");
            }
        })
    }

    modify(id, desc) {

        this.db.update({_id: id}, {$set: {description: desc}},{}, (err,doc) => {
            if(err){
                console.log("Unable to modify this goal");
            }else{
                console.log("Goal successfully modified")
            }
        })
    }
}

const data = new Goals();
data.init();
module.exports = data;