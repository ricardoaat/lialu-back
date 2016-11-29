var express         = require('express'),
    path            = require('path'),
    morgan          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    passport        = require('passport'),
    methodOverride  = require('method-override');

var libs = process.cwd() + '/libs/';
require(libs + 'auth/auth');

var config = require('./config'),
    log = require('./log')(module),
    oauth2 = require('./auth/oauth2'),
    jwtauth = require('./auth/jwtauth'),
    notFoundError = require('./errors/notFoundError.js')

var api = require('./routes/api'),
    users = require('./routes/users'),
    articles = require('./routes/articles'),
    auth = require('./routes/auth');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
//app.use(passport.initialize());
app.use(morgan('dev'));

app.use('/api', jwtauth.jwtCheck);
app.use('/auth', auth);

//app.use('/', api);
//app.use('/api', api);
//app.use('/api/users', users);
//app.use('/api/articles', articles);
//app.use('/api/oauth/token', oauth2.token);



// catch 404 and forward to error handler
app.use(function(req, res, next){
    /*
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({ 
    	error: 'Not found' 
    });
    return;
    */
    log.error("Not found ");
    next(new notFoundError("404"));
});

// error handlers
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({ 
    	error: err.message 
    });
    return;
});

module.exports = app;