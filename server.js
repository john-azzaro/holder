if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//Imports
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');


// Instantiation
mongoose.Promise = global.Promise;
const app = express();


//Module Imports
const indexRouter = require("./routes/index");


//Configuration
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout"); 


//Middleware
app.use(expressLayouts);
app.use(express.static('public'));
app.use("/", indexRouter);



//Database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))






//Routes -- See "routes" module.


//Server
let server;
server = app.listen(process.env.PORT || 3000, function() {
  console.log('Your app is listening on Port 3000...');
});
