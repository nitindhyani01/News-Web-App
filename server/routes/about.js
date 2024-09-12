const express =require('express');
const router = express.Router();
const Post=require('../models/Post');

const about='../views/layouts/about';

router.get('/about', async(req,res)=>{
    try {
        const locals={
            title:"About",
            description:"About page"
        }
        res.render('about/index',{locals,layout:about});
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;