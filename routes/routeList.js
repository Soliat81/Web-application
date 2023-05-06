const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.js');
const {check}= require('express-validator');
const {grant, verify_user, verify}= require('../auth/auth.js');


router.get("/",(req,res)=>{
    res.redirect("/about.html")
});

router.get("/profile/:user/add", verify_user, controller.render_add);
router.post("/profile/:user/add", verify_user,[
    check('category', 'You must provide a category').isIn(['Nutrition','Fitness','Lifestyle']),
    check('description', 'You must provide a description').not().isEmpty()] ,
    controller.new_goal);
router.get("/profile/:user/history", verify_user, controller.history_render);

router.post("/del/:id", verify, controller.delete);
router.post("/validate/:id", verify, controller.validate);
router.get("/update/:id", verify, controller.update_render);
router.post("/update/:id", verify, [
    check('description', 'You must provide a description').not().isEmpty()],
    controller.update_goal);


router.get("/profile/:user", verify_user, controller.profile);

router.get("/BMI", verify, controller.BMI_render);
router.post("/BMI", verify, [
    check('weight', 'Incorrect weight').not().isEmpty().bail().isNumeric(),
    check('height', 'Incorrect height').not().isEmpty().bail().isNumeric()],

    controller.calculator);


router.get("/article/:category/:id", verify,controller.renderArticle);
router.get("/article/:category", verify,controller.showCategory);
router.get("/article", verify, controller.showArticles);
router.post("/article", verify, controller.searchArticles);


router.get("/register", controller.render_register);
router.post("/register",[
    check('username', 'You must provide a username').not().isEmpty(),
    check('password', 'Non valid password').not().isEmpty().isLength({min: 7}),
    check('cpassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password))], 
    controller.new_user);

router.get("/login", controller.render_login);
router.post("/login", grant, controller.post_login);

router.get("/logout", verify, controller.logout);



router.use((err,req,res,next)=>{
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error');
});

router.use((req,res) => {
    res.status(404);
    res.type('text/plain');
    res.send('404 - Not Found');
});

module.exports = router;