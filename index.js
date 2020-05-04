var express = require("express");
const axios = require('axios')
// const funcs = require('./functions.js')
require("dotenv").config();
const handle_Bars = require('hbs')
const itemCreateRouter = require('./routes/item-create')
const itemUpdateRouter = require('./routes/item-update')
const columnUpdateRouter = require('./routes/item-name-update')
const port = process.env.PORT || 3002;
var app = express();
const viewsPath = ('./views')
app.set('view engine', 'hbs') 
app.set('views', viewsPath)
app.use(express.json());
app.use(itemCreateRouter)
app.use(itemUpdateRouter)
app.use(columnUpdateRouter)
//function in beginning of all posts to check for id etc



app.listen(port, () => console.log('Express graphlql server running on ' + port));
// test