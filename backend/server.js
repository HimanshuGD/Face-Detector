// const express=require('express');
// const bodyParser=require('body-parser');
// const bcrypt=require('bcrypt-nodejs');
// const cors=require('cors');
// const knex=require('knex');

// const app=express();


// app.use(bodyParser.json());
// app.use(cors())


// const database = knex({
//     client: 'pg',
//     connection: {
//       host : '127.0.0.1',
//       port : 5432,
//       user : 'himanshu',
//       password : '',
//       database : 'smart-brain'
//     }
//   });

// // console.log(postgres.select('*').from('users'));



// const db={
//     users:[
//         {
//             id:'123',
//             name:'himu',
//             email:'himu@123',
//             password:'cookies',
//             entries:0,
//             joined:new Date()
//         },
//         {
//             id:'456',
//             name:'poo',
//             email:'poo@123',
//             password:'poooo',
//             entries:0,
//             joined:new Date()
//         },
//         {
//             id:'789',
//             name:'goku',
//             email:'goku@123',
//             password:'gokuuuu',
//             entries:0,
//             joined:new Date()
//         },
//         {
//             id:'034',
//             name:'govind',
//             email:'govind@123',
//             password:'govinda',
//             entries:0,
//             joined:new Date()
//         }

//     ]
// }


// app.get('/',(req,res)=>{
//     res.send(db.users);
// })

// app.post('/signin',(req,res)=>{
//     if(req.body.email===db.users[0].email && req.body.password===db.users[0].password){
//         res.json('success');
//     }else{
//         res.status(400).json('error logging in');
//     }
// })

// app.post('/register',(req,res)=>{
//     const {email,name,password}=req.body;
//     database('users')
//         .returning('*')
//         .insert({
//         email:email,
//         name:name,
//         joined:new Date()
//     })
//     .then(user=>{
//         res.json(user[0]);
//     })
//     .then(err=>{})
// })

// app.get('/profile/:id',(req,res)=>{
//     const{id}=req.params;
//     let found=false;
//     db.users.forEach(user=>{
//         if(user.id===id){
//             found=true;
//             res.json(user);
//         }
//     })
//     if(!found){
//         res.status(400).json('not found');
//     }
// })

// app.put('/image',(req,res)=>{
//     const{id}=req.body;
//     let found=false;
//     db.users.forEach(user=>{
//         if(user.id===id){
//             found=true;
//             user.entries++;
//             return res.json(user.entries);
//         }
//     })
//     if(!found){
//         res.status(400).json('not found');
//     }
// })


// // bcrypt.hash("bacon", null, null, function(err, hash) {
// //     // Store hash in your password DB.
// // });

// // // Load hash from your password DB.
// // bcrypt.compare("bacon", hash, function(err, res) {
// //     // res == true
// // });
// // bcrypt.compare("veggies", hash, function(err, res) {
// //     // res = false
// // });


// app.listen(3000,()=>{
//     console.log('app is running on port 3000');
// })


const express = require('express');
// const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
     // port : 5432,
      user : 'himanshu',
      password : '',
      database : 'smart-brain'
    }
  });


const app = express();

app.use(cors())
app.use(express.json());

app.get('/', (req, res)=> { res.send(db.users) })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})