const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const path = require('path');
const passport = require('passport');

//Load Routes
const items = require('./routes/items');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

//Map Global promise - get rid of deprecation warning
mongoose.Promise = global.Promise;
//Connect to Mongoose
mongoose.connect('mongodb://localhost/checklist-dev', {
    // useMongoClient: true,
    useNewUrlParser: true
})
    .then(() => {
        console.log('MongoDB Connected...');
    })
    .catch(err => console.log(err));


//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
//body-parser middleware. need this for the bodyParser to work. 
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// override with POST having ?_method=DELETE
// Method override middleware
app.use(methodOverride('_method'));

//Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

app.use(flash());
//Global Variables
app.use(function(req, res, next){
    res.locals.successMessage = req.flash('successMessage');
    res.locals.errorMessage = req.flash('errorMessage');
    res.locals.error = req.flash('error');
    //call next piece of middleware
    next();
})

//How Middleware works:
app.use(function(req, res, next){
    req.name = 'ryan soto';
    next();
});

//index route
app.get('/', (req, res)=> {
    const title = 'Welcome to Checklist!';
    const body = 'This is the body, welcome to our page!';
    res.render('index', {
        title: title,
        body: body,
    });
});


//About route
app.get('/about', (req, res) => {
    res.render('about');
});

//Use Routes
app.use('/items', items);
app.use('/users', users)

//store port in a variable
const port = 5000;
//listen on a certain port
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

