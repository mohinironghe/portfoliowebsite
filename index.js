const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000
const mongo = require('mongodb').MongoClient;
// const uri = "mongodb+srv://mohinironghe:mohiniro%4096@mohini-68bkp.mongodb.net/test?retryWrites=true&w=majority";
 const uri = "mongodb+srv://mohinironghe:mohiniro%4096@mohini-68bkp.mongodb.net/test?authSource=admin&replicaSet=xyz";

 const server = express()
 .use(express.static(path.join(__dirname, 'public')))
  
  .get('/', (req, res) => res.render('/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))




const client =require('socket.io').listen(server).sockets;
// Connection URL
// mongo.connect('mongodb://127.0.0.1/', function(err,db){
  mongo.connect(uri,{ useNewUrlParser: true }, function(err,db){
    uri_decode_auth: true 

  if(err){
    throw err;
  }
  console.log('mongodb connected');

  client.on('connection', function(socket){
    var dbo = db.db("mohini");
    let chat =  dbo.collection("mongochat");
  //create function for status
       sendStatus = function(s){
        socket.emit('status', s);
       }
       //get all chat from monogodb
     chat.find().limit(100).sort({_id:1}).toArray(function(err,res){
        if(err){
            throw err;
        }

         socket.emit('output',res);
     });
     socket.on('input', function(data){
             let name = data.name;
             let message = data.message;
      
         if(name == '' || message == ''){
              sendStatus('please enter a name and message');
            }
          else
           {
           chat.insert({name:name,message:message},function(){
           client.emit('output',[data]);
           sendStatus({
                 message:'message send',
          clear:true
       });
       });
       }
       });
      socket.on('clear',function(data){
      
         chat.remove({}, function(){
        socket.emit('cleared');
      });
     }) ;
    });
    
     });

