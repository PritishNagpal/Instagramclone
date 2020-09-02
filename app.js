const express = require('express');
const app = express();

require('./db/mongoose');
const router = require('./Routes/auth');
const postRouter = require('./Routes/posts');
const userRouter = require('./Routes/users');

app.use(express.json())

app.use(router);
app.use(postRouter);
app.use(userRouter);

const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,() => {
    console.log(`Server Running on PORT: ${PORT}`)
})