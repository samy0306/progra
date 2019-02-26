var createError = require('http-errors');
var express = require('express');
require('dotenv').config;
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var hbs = require('express-handlebars');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

//for bodyParser
app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// view engine setup

app.set('view engine', 'hbs');

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/pages/',
    partialsDir: __dirname + '/views/partials/'
}));

app.use(session({
    secret: 'I Love Software...',
    resave: true,
    saveUninitialized: true
}));
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//MODELOS
var models = require('./models');
models.sequelize.sync().then(() => {
    console.log('Base de Datos C O N E C T A D A  :)');
}).catch(err => {
    console.log(err, "HUBO UN ERROR :/");
});

//INSERT INICIAL
//require('./controllers/init/init');

//ESTRATEGIAS PASSPORT
require('./config/passport.js')(passport, models.cuenta, models.persona, models.rol, models.actor);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).render('404', {title: "Sorry, page not found", session: req.session});
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    //res.render('error');
    console.log('Error' + err);
});

module.exports = app;
