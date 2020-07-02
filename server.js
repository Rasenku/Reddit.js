const express = require('express')
const app = express()
const port = 3000


// Assign dependencies to variables so that their methods can be accessed anywhere in the project.
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');



// // The following line must appear AFTER const app = express() and before your routes!
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))



// Set db
require('./data/reddit-db');

// Dotenv library used to encrypt passwords for security -> 'salting' a password
require('./controllers/posts.js')(app);



module.exports = app;
