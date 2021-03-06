var http = require('http'),
    path = require('path'),
    methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    passport = require('passport'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose');

var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = express();

app.use(cors()); // 跨域响应头

// Normal express config defaults
app.use(require('morgan')('dev')); // 请求日志
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded parser
app.use(bodyParser.json()); // application/json parser

app.use(require('method-override')()); // 增加请求类型
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  })); // session 模块，默认存储在内存，跨域无效

if (!isProduction) {
  app.use(errorhandler()); // 开发模式下，错误捕捉
}

if(isProduction){
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://localhost/conduit');
  mongoose.set('debug', true);
}

// MongoDB 模式
require('./models/User');
require('./models/Article');
require('./models/Comment');

/* 
1. ./models/User  数据模式：初始化jwt...
2. ./routes/api/users  路由，依赖 1.4.5
3. ./routes/api/articles  路由，依赖 1.4.5
4. ./routes/auth  从请求头获取并校验jwt
5. ../config/passport  拦截请求参数获取数据模型
 */
require('./config/passport');

app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

// finally, let's start our server...
var server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});
