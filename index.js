const express = require('express')
const app = express()

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const passport = require('passport')


const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

(async()=> {
    await require('db.js').connect();
})
require('./auth')(passport);

app.use(session({
    store: new MySQLStore({
        host:'localhost',
        port: '3306',
        user: 'root', 
        password: 'aew!2121',
        database: 'passport'
    }),  
    secret: '123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 1000 } 
}))

app.use(passport.initialize());
app.use(passport.session());

function authenticationMiddleware(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send("<h1>Não autenticado</h1>");
}
 

app.get('/',(req,res)=>{
    res.render('./index')
})

app.get('/senhaErrada',(req,res)=>{
    res.send('<h1>usuario ou senha incorretos</h1></h1>')
})

app.get('/logado', authenticationMiddleware, (req,res)=>{
    res.send('<h1>logado</h1>');
})

app.post('/',
    passport.authenticate('local', { 
        successRedirect: '/logado', 
        failureRedirect: '/senhaErrada' 
    })
);


app.listen('3000', ()=>{console.log('Online');})