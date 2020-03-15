var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const index = require('./routes/index');
const comic = require('./routes/comic');

var app = express();

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

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/comics', comic);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
