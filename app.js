var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const {
    startDB
} = require('./models/db');

const index = require('./routes/index');
const auth = require('./routes/auth');
const comic = require('./routes/comic');
const profile = require('./routes/profile');
const comment = require('./routes/comment');
const adminAuth = require('./routes/admin-auth');
const adminUpload = require('./routes/admin-upload');

var app = express();

/* Login script */
var passport = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
require('./config/passport')(passport);
app.use(passport.initialize());


const setup = async () => {
    await startDB();
}
setup();

const whitelist = new Set([
    'http://localhost:4200',
    'https://webcomics.pk',
    undefined
]);
const corsOptions = {
    origin(origin, callback) {
        if (whitelist.has(origin)) {
            callback(null, true);
            return;
        } else {
            callback(new Error(`Origin "${origin}" not allowed by CORS`));
            return;
        }
    }
};

app.use(function(req, res, next) {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
   //res.header("Content-Type", "application/json; charset=utf-8");
   res.setHeader('Access-Control-Allow-Credentials', true);
   next();
});

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json({ limit : "50mb" })); 
app.use(express.urlencoded({ limit:"50mb", extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/auth', auth);
app.use('/comic', comic);
app.use('/profile', profile);
app.use('/comments', comment);
app.use('/admin', adminAuth);
app.use('/admin', adminUpload);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error 404 and foward to error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.error(err);

    if (err.constraint) {
        res.status(400)
            .json({
                errorType: 'constraint-error',
                constraint: err.constraint
            });
        return;
    }

    res.sendStatus(err.status || 500);
});

module.exports = app;
