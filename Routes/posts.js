const express = require('express');
const router = express.Router();
const Posts = require('../Models/PostSchema/posts');
const loginMiddleware = require('../middleware/loggedin');


router.get('/allposts',loginMiddleware,(req,res) => {
    Posts.find()
    .populate('comments.postedBy','_id name')
    .populate('author','name _id')
    .then((posts) => {
        res.json(posts);
    })
    .catch((e) => {
        console.log(e);
    })
})
router.get('/followerpost',loginMiddleware,(req,res) => {
    Posts.find({ author:{ $in: req.user.following } })
    .populate('comments.postedBy','_id name')
    .populate('author','name _id')
    .then((posts) => {
            res.json(posts);
    })
    .catch((e) => {
        console.log(e);
    })
})

router.get('/myposts',loginMiddleware,(req,res) => {
    Posts.find({author: req.user._id})
    .populate('author','name _id')
    .populate('comments.postedBy','name _id')
    .then((posts) => {
        res.json(posts);
    })
    .catch((e) => {
        console.log(e);
    })
})

router.post('/createpost',loginMiddleware,(req,res) => {
    const { title,body,pic }  = req.body;
    console.log(title,body,pic);
    if(!title || !body || !pic ){ 
        return res.status(422).json({error: 'Please fill all required fields'});
    }
    req.user.password = undefined;
    const post = new Posts({
        title,
        body,
        photo: pic,
        author: req.user
    })
    .save()
    .then((savedPost) => {
        res.json({savedPost});
    })
    .catch((e) => {
        console.log(e);
    })
})

router.put('/likes',loginMiddleware,(req,res) => {
    const id = req.body.id;
    Posts.findByIdAndUpdate({_id: id},{
        $addToSet: {likes: req.user._id}
    },{
        new: true
    })
    .populate('author','_id name')
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike',loginMiddleware,(req,res) => {
    Posts.findByIdAndUpdate(req.body.postId,{
        $pull: {likes: req.user._id}
    },{
        new: true
    })
    .populate('author','_id name')
    .exec((err,response) => {
        if(err){
            return res.status(422).json({error:err})
        }
        res.json(response)
    })

});

router.put('/comment',loginMiddleware,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Posts.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate('author','_id name')
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',loginMiddleware,(req,res)=>{
    Posts.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        console.log(post.postedBy._id)
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json({message: 'Successfully deleted'})
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

module.exports = router;