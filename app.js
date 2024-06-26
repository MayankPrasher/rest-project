const path = require('path');
const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');


const multer = require('multer');
const {graphqlHTTP} = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/Auth');

const app = express();


// const http = require('http').Server(app);

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
   if(req.method === 'OPTIONS'){
      return res.sendStatus(200);
   }
   next();
});
app.use(auth);
app.use('/graphql',graphqlHTTP({
   schema:graphqlSchema,
   rootValue:graphqlResolver,
   graphiql:true,
   formatError(err){
      if(!err.originalError){
         return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occured.";
      const code = err.originalError.code || 500;
      return {message : message , status: code , data : data};
   }
}));

app.use((error,req,res,next)=>{
   console.log(error);
   const status = error.statusCode||500;
   const message = error.message;
   const data = error.data;
   res.status(status).json({message:message,data:data});
});

mongoose         
.connect('MONGO DB URL')
.then(result=>{
  
    app.listen(8080);
  
})
.catch(err=>console.log(err));


