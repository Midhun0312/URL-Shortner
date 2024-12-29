const express = require('express');
const {connectToMongoDB} = require('./connect')
const urlRoute = require('./routes/url');
const URL = require('./models/url');
const path = require('path');
const staticRoute = require('./routes/staticRouter');

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>console.log('Mongodb connected'));

app.set("view engine" , "ejs");
app.set('views', path.resolve("./views")); // ejs files folder

app.use(express.json());
app.use('/url' , urlRoute);

app.use("/" , staticRoute);

app.get('/url/:shortId', async (req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    },{$push:{
        visitHistory: {
            timestamp : Date.now(),
        },
    },
    });
    res.redirect(entry.redirectURL);
})

app.listen(PORT, ()=>console.log(`server started at port : ${PORT}`));