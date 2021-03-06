
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var methodOverride = require('method-override');
var session = require('express-session');
var app = express();
require('./db/db')


app.use(session({
  secret: "This is a random string secret",
  resave: false,
  saveUninitialized: false
}))



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));

// setting the global variable for the views and points to req.session
app.use((req, res, next)=> {
  //req.locals
  res.locals.thatUser = req.session.user
  next()
})


//routes
var authRouter = require('./routes/authentication')
var reviewsRouter = require('./routes/reviews');
var usersRouter = require('./routes/users');
var movieRouter = require('./routes/movies')

app.get('/', (req, res) => {
  res.render('index', {
    message: req.session.message
  })
})


app.use('/authentication', authRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => req.session.logged ? next() : res.redirect('/'));


app.use('/reviews', reviewsRouter);
app.use('/movies', movieRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
