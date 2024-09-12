const express =require('express');
const router = express.Router();
const Post=require('../models/Post');

const viewpost='../views/layouts/view-post';

router.get('/view-post', async(req,res)=>{
    try {
        const locals={
            title:"View Post",
            description:"View News"
        }
        res.render('view-post/index',{locals,layout:viewpost});
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;