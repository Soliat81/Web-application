const Datastore = require('nedb');
const bcrypt = require('bcrypt');
const saltRounds = 10;


class UserDAO {
    constructor(dbFilePath) {
        if(dbFilePath){

            this.db = new Datastore({ filename: dbFilePath, autoload: true});

        }else{

            this.db = new Datastore();

        }
    }

    init() {
        this.db.insert({
            User: "Peter",
            Password: "$2b$10$I82WRFuGghOMjtu3LLZW9OAMrmYOlMZjEEkh.vx.K2MM05iu5hY2C"
        });
        this.db.insert({
            User: "Ann",
            Password: "$2b$10$bnEYkqZM.MhEF/LycycymOeVwkQONq8kuAUGx6G5tF9UtUcaYDs3S"
        });
        console.log('database set up')
    }

    add(username, password) {

        const base = this;

        bcrypt.hash(password, saltRounds).then(function(hash) {
            var input = {
                User: username,
                Password: hash,
            };
            base.db.insert(input, (err)=>{
                if(err){
                    console.log("Error while adding the user")
                }
            });
        });
    }

    search(user, cb) {
        this.db.find({'User': user}, (err,entry)=>{
            if (err) {
                return cb(err,null);
            }else{
                if (entry.length == 0) {
                    return cb(null,null);
                }else{
                    return cb(null, entry[0]);
                }

            }
        })
    }

}

const dao = new UserDAO();
dao.init();

module.exports = dao;
