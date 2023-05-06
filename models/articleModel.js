const Datastore = require('nedb');

class articleDAO{
    constructor(dbFilePath) {
        if(dbFilePath){
            this.db = new Datastore({ filename: dbFilePath, autoload: true});

        }else{
            this.db = new Datastore();
        }
    }

    init() {
        this.db.insert({
            Category: 'Fitness',
            title: 'What exercises should you try',
            illustration: "/pexels-pixabay-40751.jpg",
            content: '/exercises.html',

        });
        this.db.insert({
            Category: 'Nutrition',
            title: 'Alternatives to meat',
            illustration: "/pexels-krisztina-papp-2374946.jpg",
            content: '/proteins.html',

        });
        this.db.insert({
            Category: 'Lifestyle',
            title: 'The importance of sleep',
            illustration: "/pexels-shvets-production-7191951.jpg",
            content: '/sleep.html',

        });
        console.log('Articles set up');
    }

    getByCategory(category) {
        return new Promise((resolve, reject)=>{
            this.db.find({'Category': category}, (err, docs)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(docs);
                }
            })
        })
        
    }

    getByTitle(title) {
        if(title === undefined){
            return new Promise((resolve, reject)=>{
                this.db.find({}, (err, docs)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(docs);
                    }
                })
            })
        }else{

            return new Promise((resolve, reject)=>{
                let search = new RegExp(title);
                this.db.find({'title': search}, (err, docs)=>{    //Regular expression: we search for all articles containing the string
                    if(err){
                        reject(err);
                    }else{
                        resolve(docs);
                    }
                })
            })

        }
        
    }

    getArticle(id) {

        return new Promise((resolve, reject)=>{
            this.db.find({'_id': id}, (err, article)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(article);
                }
            })
        })

    }

}

module.exports = articleDAO;