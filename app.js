//Required Modules
const express=require('express');
const morgan=require('morgan');
const methodOverride=require('method-override');
const mongoose=require('mongoose');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const mainRoutes=require('./routes/mainRoutes');
const officeRoutes=require('./routes/officeRoutes');
const userRoutes=require('./routes/userRoutes');
const adminRoutes=require('./routes/adminRoutes');


//App Creation
const app=express();

//App Configuration
const port=3000;
const host='localhost';
app.set('view engine','ejs');

//Database Connection
mongoose.connect('mongodb://localhost:27017/ssdi_project')
.then(()=>{
    //start the server
    app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
});
})
.catch(err=>console.log(err.message));

//Middleware Functions
app.use(
    session({
        secret: "qwerty1a3d5f6h2vm9mj0",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/ssdi_project'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    res.locals.user=req.session.user||null;
    res.locals.username=req.session.username||null;
    res.locals.isAdmin=req.session.isAdmin||false;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//Routes
app.use('/',mainRoutes);
app.use('/offices',officeRoutes);
app.use('/users',userRoutes);
app.use('/admins',adminRoutes);

app.use((req,res,next)=>{
    let err=new Error('The server cannot locate '+req.url);
    err.status=404;
    next(err);
});


app.use((err,req,res,next)=>{
    if(!err.status){
        err.status=500;
        err.message='Internal Server Error';
    }
    res.status(err.status);
    res.render('error',{error:err});
});