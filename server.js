
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
const mongo = require('mongodb').MongoClient;


const client =require('socket.io').listen(4000).sockets;
// Connection URL
mongo.connect(process.env.DATABASE_URL, function(err,db){
  if(err){
    throw err;
  }
  console.log('mongodb connected');

  client.on('connection', function(socket){
    var dbo = db.db("mongochat");
    let chat =  dbo.collection("chats");
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



// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/index.html');
//   });
// var url = "mongodb://localhost:27017/";
// // Database Name
// const dbName = 'chat-app';

// // Use connect method to connect to the server

// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected successfully ");

//   const dob = db.db(dbName);
//     client.on('connection',function(socket){
//         let chat = dob.collection('chats');
//         //create function for status
//         sendStatus = function(s){
//             socket.emit('status', s);
//         }
//         //get all chat from monogodb
//         chat.find().limit(100).sort({_id:1}).toArray(function(err,res){
//             if(err){
//                 throw err;
//             }

//             socket.emit('output',res);
//         });
//         socket.on('input', function(data){
//             let name = data.name;
//             let message = data.message;

//             if(name == '' || message == ''){
//                 sendStatus('please enter a name and message');
//             }else {
//                 chat.insert({name:name,message:message},function(){
//                     client.emit('output' , [data]);

//                     sendStatus({
//                         message:'message send',
//                         clear:true
//                     });
//                 });
//             }
//         });
//        socket.on('clear',function(data){

//         chat.remove({}, function(){
//             socket.emit('cleared');
//         })
//        }) 
//     });
//   db.close();
// });