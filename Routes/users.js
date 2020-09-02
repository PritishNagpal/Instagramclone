const express = require('express');
const router = express.Router();
const Posts = require('../Models/PostSchema/posts');
const loginMiddleware = require('../middleware/loggedin');
const User = require('../Models/UserSchema/users');

router.get('/profile/:id',loginMiddleware,(req,res) => {
    User.findOne({_id:req.params.id})
    .select('-password')
    .then(user => {
        Posts.find({author: req.params.id})
        .populate('author','_id name')
        .exec((err,posts) => {
            if(err){
                return res.status(422).json({error: err})
            }
            res.json({user,posts})
        })
    })
    .catch(e => {
        res.status(404).json({error: 'User Not Found'})
    })
})

router.put('/follow',loginMiddleware,(req,res)=>{
    User.findByIdAndUpdate(req.body.followid,{
        $addToSet:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $addToSet:{following:req.body.followid}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    })
})

router.put('/unfollow',loginMiddleware,(req,res) => {
    User.findByIdAndUpdate(req.body.unfollowid,{
        $pull: { followers: req.user._id }
    },{
        new: true
    },(err,result) => {
        if(err){
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull: { following: req.body.unfollowid }
        },{
            new: true
        }).select('-password').then(result => res.json(result))
        .catch(e => console.log(e))
    })
})

router.post('/search-users',(req,res) => {
    let userPattern = new RegExp('^'+req.body.query)
    User.find({email: {$regex: userPattern}})
    .select('_id email')
    .then(record => {
        res.json(record)
    })
    .catch(e => console.log(e))
})

module.exports = router;