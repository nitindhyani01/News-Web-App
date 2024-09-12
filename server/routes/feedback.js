const express =require('express');
const router = express.Router();
const Post=require('../models/Post');

const feedback='../views/layouts/feedback';

router.get('/feedback', async(req,res)=>{
    try {
        const locals={
            title:"feedback",
            description:"News website feedback"
        }
        res.render('feedback/index',{locals,layout:feedback});
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;