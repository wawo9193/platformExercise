const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

//use this instead of bodyparser setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//using this path to go to api
app.use('', require('./routes/api'));

app.listen(PORT, function(req, res) { 
    console.log('Successfully connected to ' + PORT);
});
