var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors')
var indexRouter = require('./routes/index');
var productRouter = require('./routes/api/ProductAPI')
var userRouter = require('./routes/api/UserAPI')
var categoryRouter = require('./routes/api/CategoryAPI')
var cartRouter = require('./routes/api/CartApi')
var orderRouter = require('./routes/api/orderApi')
var reviewRouter = require('./routes/api/ReviewApi')
var app = express();

// mongo DB connect
mongoose.connect('mongodb://127.0.0.1:27017/FashionFiesta?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false', {
  
}).then(() => console.log('Database Connected!')).catch(err => console.log('Database Error: ', err));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use('/', indexRouter);
app.use('/api/productApi', productRouter)
app.use('/api/userApi', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/reviews', reviewRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
