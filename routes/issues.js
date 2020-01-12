//Imports
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Issue } = require('../models/issue');
const { Category } = require('../models/category');
const upload = multer({

});


// Routes
// All Issues Route
router.get('/', async function(req, res) {
  res.send('All issues works!')
});


//New Issue Route
router.get('/new', async function(req, res) {
  try {
    const categories = await Category.find({});
    const issue = new Issue();
    res.render('issues/new', {
      categories: categories,
      issue: issue
    });
  } catch (err) {
    res.redirect('/issues');  
  }
});


// Create Issue Route
router.post('/', async function(req, res) {
  const issue = new Issue({
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    solution: req.body.solution
  });
});


//Export
module.exports = router;
