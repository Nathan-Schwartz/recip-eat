var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '../public')); // idk if I can append '..'




app.listen(4568);



app.get()

app.post()


app.listen(1337);
console.log("App is listening");
