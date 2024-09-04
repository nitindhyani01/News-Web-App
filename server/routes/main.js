const express =require('express');
const router = express.Router();

//Routes

router.get('',(req,res)=>{
    const locals ={
        title:"NodeJs News",
        description: "Simple News website with NodeJs, Express & MongoDb."
    }
    res.render('./layouts/index',{locals});
});


module.exports = router;