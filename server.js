const express=require('express');
const app=express();
const hbs=require('hbs');
const mysql=require('mysql');
const path=require('path');
const flash=require('connect-flash');
const session=require('express-session');
const port=process.env.port||8080;
app.use(express.static(__dirname+'/views'));
app.use(express.static(__dirname+'/public'));
app.use(express.static('public'));
app.set('view engine','hbs');
app.set('views','views');
app.use(flash());
app.use(session({
    secret:'cat is dead',
    cookie: { maxAge: 60000 }
}));
var patientRoute=require('./routes/patient');
    doctorRoute=require('./routes/doctor');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'shradha-khapra',
    password : 'shradha@123',
    database : 'healthcare'
});

app.listen(port,function(){
    console.log("application running on port: "+port);
});

app.use(function(req, res, next){
    //res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(patientRoute);
app.use(doctorRoute);
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname, '../DBMS-project/views', 'mainpage.html'));
});

app.get('/doctors',function(req,res){
    res.sendFile(path.join(__dirname, '../DBMS-project/views', 'doctors.html'));
});
app.get('/patients',function(req,res){
    res.sendFile(path.join(__dirname, '../DBMS-project/views', 'patients.html'));
});
