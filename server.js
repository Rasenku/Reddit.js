require('dotenv').config();
// Initialize
const express = require('express');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const app = express();
//custom middleware to auth token
var checkAuth = (req, res, next) => {
    console.log("Checking authentication")
    if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null
    } else {
    var token = req.cookies.nToken
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
    }

    next();
};

exphbs = require('express-handlebars'),
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



app.get('/', (req, res) => {
    res.redirect('/posts/index')
})

app.get('/posts/new', (req, res) => {
    let currentUser = req.user
    res.render('posts-new', { currentUser })
})


app.use(cookieParser());
app.use(express.static('public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(checkAuth);
require('./controllers/posts')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);


app.use(expressValidator());


// Set db
require('./data/reddit-db');
app.use(checkAuth);



app.listen(3000, () => {
    console.log('Listening on port 3000');
})

module.exports = app;
