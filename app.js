var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const {
    startDB
} = require('./models/db');

const index = require('./routes/index');
const comic = require('./routes/comic');
const profile = require('./routes/profile');
const comment = require('./routes/comment');
//const upload = require('./routes/upload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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

//app.use(cors(corsOptions));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
//app.use('/upload', upload);
app.use('/api/comics', comic);
app.use('/api/profile', profile);
app.use('/api/comment', comment);

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
