//Imports and variables
const express = require('express');
const router = express.Router();
const Issue = require('../models/issue');
const { Category } = require('../models/category');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];  


// All Issues Route
router.get('/', async function(req, res) {
let searchOptions = {}
  if (req.query.title != null && req.query.title !== '') {
    searchOptions.title = new RegExp(req.query.title, 'i')
  }   
  try {
    const issues = await Issue.find(searchOptions)
    res.render('issues/index', {   
      issues: issues, 
      searchOptions: req.query  
    });
  } catch(err) {
    res.redirect('/');   
  }
});


//New Issue Route
router.get('/new', async function(req, res) {
  renderNewPage(res, new Issue());
});


// Create Issue Route
router.post('/', async function(req, res) {    
  // const fileName = req.file != null ? req.file.filename : null;  
  const issue = new Issue({
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    solution: req.body.solution,
  });
  saveImage(issue, req.body.image);        
  try { 
    const newIssue = await issue.save();
    // res.redirect(`/issues/${ newIssue.id }`);
    res.redirect('issues');
  } catch(err) {
    renderNewPage(res, issue, true); 
  }
});


// Show Route
router.get('/:id', async function(req, res) {
  try {
    const issue = await Issue.findById(req.params.id)
                             .populate('category')
                             .exec()              
    res.render('issues/show', {issue: issue})    
  } catch(err) {
    res.redirect('/');  
  }
});


// Edit Issue Route
router.get('/:id/edit', async function(req, res) {
  try {
    const issue = await Issue.findById(req.params.id);  
    renderEditPage(res, issue);
  } catch(err) {
    res.redirect('/')
  } 
});


// Update Issue Route
router.put('/:id', async function(req, res) {                       
  let issue;                                                        // create an issue variable...                                             
  try { 
    issue = await Issue.findById(req.params.id)                     // and the issue will be the Issue found by id with the id passed in.
    issue.category = req.body.categoryId;                           // then take the issue and set all the parameters you need such as the title...
    issue.decription = req.body.description;                              
    issue.solution = req.body.solution;                             
    if (req.body.image != null && req.body.image !== '') {           // and check to see if the image is passed in.
      saveImage(issue, req.body.image)                                // and if it is save the image.
    } 
    await issue.save()                                               // and lastly if the issue was saved you can render the book by...
    res.redirect(`/issues/${issue.id}`);                             // redirecting to the issues/issue page
  } catch(err) {
    if (issue != null) {                                             // if we got the book BUT there was an issue trying to save the page, then 
      renderEditPage(res, issue, true);                              // rerender the edit page.
    } else {
      redirect('/')                                                  // otherwise redirect to the homepage
    }
    
  }
});


// Render New Page function
async function renderNewPage(res, issue, hasError = false) { 
  renderFormPage(res, issue, 'new', hasError);                      
}


// Render Edit Page function
async function renderEditPage(res, issue, hasError = false) {   
  renderFormPage(res, issue, 'edit', hasError);                
}


// Render Form Page function
async function renderFormPage(res, issue, form, hasError = false) {       
  try {
    const categories = await Category.find({}); 
    const params = {
      categories: categories,
      issue: issue
    }
    if (hasError) {                                              // if there is an error
      if (form === 'edit') {                                     // and if the form is equal to edit, then
        params.errorMessage = 'Error Updating Issue';            // send the following error message.
      } else {                                                   // other wise...
        params.errorMessage = 'Error Creating Issue';            // send the error creating issue
      }
    }
    res.render(`issues/${form}`, params);       
  } catch (err) {
    res.redirect('/issues');  
  }
}


function saveImage(issue, imageEncoded) {  
  if(imageEncoded == null)  {
    return 
  }
  const image = JSON.parse(imageEncoded);        
  if (image != null && imageMimeTypes.includes(image.type)) {       
    issue.image = new Buffer.from(image.data, 'base64')            
    issue.imageType = image.type   
    }                  
}



//Export
module.exports = router;
