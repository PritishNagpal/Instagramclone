const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult} = require('express-validator');
const User = require('../Models/UserSchema/users');
const keys = require('../config/keys');
const loginMiddleware = require('../middleware/loggedin');
const nodemailer = require('nodemailer');

const router = express.Router();
const transport = nodemailer.createTransport(({
    service: 'gmail',
    auth:{
        user: keys.email,
        pass: keys.password
    }
}));

router.post('/signup',[

    body('name')
    .trim(),

    body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),

    body('password')
    .isLength({min: 8})
    .withMessage('Password must contain atleast 8 characters')
    .not().isIn(['123', 'password', 'god'])
    .withMessage('Do not use a common word as the password')
],(req,res) => {
    const {name,email,password,confirmPassword} = req.body;
    // console.log(req.body);
    const errors = validationResult(req);
    /*if(!email || !password || !name || !confirmPassword){
        return res.status(422).json({error: 'Please fill all required fields'})
    }*/
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    /*if(password != confirmPassword){
        return res.status(404).json({error: 'Password must match'});
    }*/
    
    User.findOne({email})
    .then((existingUser) => {
        if(existingUser){
            return res.status(404).send('Email already exists');
        }
        crypto.randomBytes(32,(err,buffer) => {
            if(err){
                return res.status(422).json({error: err})
            }
            
            const token = buffer.toString('hex');
            bcrypt.hash(password,10)
            .then(hashedPassword => {
                const user = new User({
                    email,
                    name,
                    password: hashedPassword,
                    verifyToken: token,
                    verified: false,
                    profilePic
                }).save()
                .then(() => {
                    res.json({message: 'Please check your email'});
                    transport.sendMail({
                        to: email,
                        from: 'no-reply@ig.com',
                        subject: 'Account Verification',
                        html: `
                           <h4>Thank You for joining the platform</h4>
                           <h5>To get successfully registered you need to verify your email</h5>
                           <p>Please click <a href="http://localhost:3000/verify-email/${token}">here</a>to verify your account</p>
                        `
                    })
                    .then(msg => console.log('Email sent'))
                    .catch(e => console.log(e))
                }) 
            })
            
        .catch((e) => {
            console.log(e);
        })

    })
             
}).catch((e) => {
        console.log(e);
    })
});

router.post('/verify-email',(req,res) => {
    const sentToken = req.body.token;
    User.findOne({verifyToken: sentToken})
    .then((user) => {
        user.verified = true;
        user.verifyToken = undefined;
        // console.log(user)
        user.save().then((savedUser) => console.log(savedUser))
    })
    
})

router.post('/signin',(req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(404).json({error: 'Please enter email and password!'});
    }
    User.findOne({email})
    .then((savedUser) => {
        if(!savedUser){
            return res.status(404).json({error: 'Invalid email or password'})
        }
        bcrypt.compare(password,savedUser.password)
        .then((matched) => {
            if(matched && savedUser.verified){
                // res.status(200).json({message: 'Logged in Successfully'});
                // res.send(`Welcome ${req.name}`)
                const token = jwt.sign({_id: savedUser._id},keys.secretKey);
                const {_id,name,email,followers,following,profilePic} = savedUser;
                
                res.json({ token, user: {_id,name,email,followers,following,profilePic}});

            }
            else if(!savedUser.verified){
                res.status(422).json({error: 'Please verfiy your account from email'})
            }
            else{
                return res.status(404).json({error: 'Invalid email or password'})
            }
        })
        .catch((e) => {
            console.log(e);
        })
    })
    .catch((e) => {
        console.log(e);
    })
});

router.post('/reset-password',(req,res) => {
    crypto.randomBytes(32,(err,buffer) => {
        if(err){
            return console.log(err);
        }
        // console.log(buffer);
        const token = buffer.toString('hex');
        // console.log(token);
        User.findOne({email:req.body.email})
        .then(user => {
            if(!user){
                return res.status(422).json({error: 'No user with that email'})
            }
            user.resetToken = token;
            user.expireToken = Date.now() + 3600*1000;
            user.save().then(result => {
                transport.sendMail({
                    to: user.email,
                    from: 'no-reply@gmail.com',
                    subject: 'Reset password link',
                    html: `
                    <p>You Requested for password reset</p>
                    <h5>Click <a href="http://localhost:3000/reset/${token}">here</a> to reset Password</h5>
                    <p> This link will expire after 1 hour </p>
                    `
                })
                res.json({message: 'Please Check Your mail'})
            })
        })
    })
})

router.post('/reset-password',(req,res) => {
    crypto.randomBytes(32,(err,buffer) => {
        if(err){
            return console.log(err);
        }
        // console.log(buffer);
        const token = buffer.toString('hex');
        // console.log(token);
        User.findOne({email:req.body.email})
        .then(user => {
            if(!user){
                return res.status(422).json({error: 'No user with that email'})
            }
            user.resetToken = token;
            user.expireToken = Date.now() + 3600*1000;
            user.save().then(result => {
                transport.sendMail({
                    to: user.email,
                    from: 'no-reply@gmail.com',
                    subject: 'Reset password link',
                    html: `
                    <p>You Requested for password reset</p>
                    <h5>Click <a href="http://localhost:3000/reset/${token}">here</a> to reset Password</h5>
                    <p> This link will expire after 1 hour </p>
                    `
                })
                res.json({message: 'Please Check Your mail'})
            })
        })
    })
})

router.post('/reset-pass',(req,res) => {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({resetToken: sentToken,expireToken: {$gt: Date.now()}})
    .then(user => {
        if(!user){
            return res.status(422).json({error: 'Session Expired'})
        }
        bcrypt.hash(newPassword,10)
        .then(pass => {
            user.password = pass;
            user.resetToken = undefined;
            user.expireToken = undefined;
            user.save().then(savedUser => res.json({message: 'Password updated Sucessfully!'}))
        })
    })
    .catch(e => console.log(e))
});


router.get('/profilepic',loginMiddleware,(req,res) => {
    const _id = req.user._id;
    User.findById(_id)
    .then(user => {
        res.json({picUrl: user.profilePic})
    })
    .catch(e => console.log(e));
});

// router.post('/updateProfilePic',loginMiddleware,(req,res) => {
//     const _id = req.user._id;
//     User.findById({_id})
//     .then(user => {
//         user.profilePic = req.body.img;
//         user.save()
//     })
// })

router.put('/updateProfilePic',loginMiddleware,(req,res) => {
    User.findByIdAndUpdate(req.user._id,{
        $set: {profilePic: req.body.img}
    },{ new: true },(err,result) => {
        if(err){
           return res.status(422).json({error: 'Something went wrong'})
        }
        res.json(result);
    })
})


module.exports = router;
