var express = require("express");
const router = new express.Router()
// const funcs = require('./functions.js')
require("dotenv").config();


router.post("/monday", (req, res) => {
    console.log(req.body);
    // const nopes = ["Nah", "Nuh uh","Ha! No", "No way!", "who the hell are you?", "Jeffrey Epstein didnt' kill himself."]
    // console.log(nopes[Math.floor(Math.random()*nopes.length)]);
    // res.send(nopes[Math.floor(Math.random()*nopes.length)]);
  });

  module.exports = router