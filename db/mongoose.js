const keys = require('../config/keys');
const mongoose = require('mongoose');

const connectionURL = keys.mongooseURI;

mongoose.connect(connectionURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex:true
},() => {
    console.log("Database is Connected");
})
