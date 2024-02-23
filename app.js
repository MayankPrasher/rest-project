const path = require('path');
const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();

const storage = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, 'images');
   },
   filename: function(req, file, cb) {
       cb(null, uuidv4())
   }
});

const fileFilter = (req,file,cb)=>{
   if(
      file.mimetype === 'image/png'||
      file.mimetype === 'image/jpg'||
      file.mimetype === 'image/jpeg'
   ){
      cb(null,true);
   }else{
      cb(null,false);
   }
};

app.use(bodyParser.json());
app.use(multer({storage:storage , fileFilter:fileFilter}).single('image'));
app.use('/images',express.static(path.join(__dirname,'images')));

app.use((req,res,next)=>{
   res.setHeader('Access-Control-Allow-Origin',"*");
   res.setHeader('Access-Control-Allow-Methods',"GET,POST,PUT,PATCH,DELETE");
   res.setHeader('Access-Control-Allow-Headers',"Content-Type,Authorization");
   next();
});
app.use('/feed',feedRoutes);

app.use((error,req,res,next)=>{
   console.log(error);
   const status = error.statusCode||500;
   const message = error.message;
   res.status(status).json({message:message});
});

mongoose
.connect('mongodb+srv://prasher6789:Mayank%401509@cluster0.dxwz3zy.mongodb.net/messages')
.then(result=>{
   app.listen(8080);
})
.catch(err=>console.log(err));


