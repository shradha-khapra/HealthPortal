const express=require('express');
const app=express();
const mysql=require('mysql');
const flash=require('connect-flash');
const bodyParser=require('body-parser');
app.use(flash());
app.use(express.static(__dirname+'/views'));
app.set('view engine','hbs');
app.set('views','views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'shradha-khapra',
    password : 'shradha@123',
    database : 'healthcare'
});



app.post('/dregister',function(req,res){
    var x=req.body;
    connection.query('insert into ddata(first,last,blood,aadhar,password,dept,post,postgrad,patients) values("'+x.first+'","'+
        x.last+'","'+x.blood+'",'+x.aadhar+',"'+x.password+'","'+x.dept+'","'+x.post+'","'+x.postgrad
        +'",'+0+');',function(err,result){
        if(err)
        {   console.log(err);
            res.redirect('/doctors'); }
        else
            connection.query('select * from ddata where aadhar='+x.aadhar+';',function(err,result){
                res.render('doctor', {
                    data: result[0],
                    pat: 'no patients yet',
                    length:0
                });
            });


    });
});

app.post('/dlogin',function(req,res){
    var x=true; var pat;
    connection.query('select * from logs where docId='+req.body.userId+';',function(err,result){
       if(!err)
       {pat=result; console.log(pat);}
       else
           console.log(err);
        connection.query('select * from ddata',function(err,result){
            if(err) {
                console.log('SOMETHING WENT WRONG!!');
                res.redirect('/doctors');
            }
            for(var i=0;i<result.length;i++)
                if(result[i].userId==req.body.userId && result[i].password==req.body.password)
                {
                    x=false;
                    if(pat.length>0) {
                        console.log(pat);
                        res.render('doctor', {
                            data: result[i],
                            pat: pat,
                            length: pat.length
                        });
                    }
                    else
                        res.render('doctor', {
                            data:result[i],
                            pat:'no patients yet',
                            length:0

                        });

                }
            if(x) {
                console.log("USER doesn't exist in system!!");
                res.redirect('/doctors');
            }

        });

    });

});

app.get('/dlogout',function(req,res){
    res.redirect('/doctors');
});

app.post('/ddelete',function(req,res){
    connection.query('delete from logs where docId='+req.body.userId+';',function(err,result){
        if(err)
            console.log(err);
    });
    connection.query('delete from ddata where userId='+req.body.userId+';',function(err,result){
        if(err)
            console.log(err);
        res.redirect('/doctors');
    })
});

app.post('/dmanage',function(req,res){
    var x=req.body;
    if(x.add)
    {connection.query('update ddata set address="'+x.add+'" where userId='+x.userId+';',
        function(err,result){
            if(err)
            { console.log('ERROR');}
        });}
    if(x.phone)
    {connection.query('update ddata set phone='+x.phone+' where userId='+x.userId+';',
        function(err,result){
            if(err)
            { console.log('ERROR');}
        });}
    connection.query('select * from logs where docId='+req.body.userId+';',function(err,result) {
        if (!err)
            pat = result;
        else
            console.log(err);
        connection.query('select * from ddata where userId=' + req.body.userId + ';', function (err, result) {
            if(pat.length>0)
                res.render('doctor', {
                data: result[0],
                pat:pat ,
                length:pat.length
            })
            else
                res.render('doctor', {
                    data: result[0],
                    pat:'no patients yet',
                    length:0
                })
        })
    })
});


module.exports=app;