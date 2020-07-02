const Post = require('../models/post');
const User = require('../models/user');

module.exports = app => {
    // INDEX
    app.get('/', (req, res) => {
        var currentUser = req.user;
        console.log(req.cookies);

        Post.find({}).lean()
        .populate('author')
            .then(posts => {
                res.render("posts_index", { posts, currentUser });
            })
            .catch(err => {
                console.log(err.message);
        });
    });

    // NEW
    app.get('/posts/new', async (req, res) => {
        var currentUser = req.user;
        try {
            return res.render('posts_new', { currentUser })
        } catch (err) {
            return console.log(err);
        }
    })

    // CREATE
    app.post("/posts/new", (req, res) => {
        if (req.user) {
            var post = new Post(req.body);
            post.author = req.user._id;
            post.upVotes = [];
            post.downVotes = [];
            post.voteScore = 0;
            post.author = req.user._id;
            post
                .save()
                .then(post => {
                    return User.findById(req.user._id);
                })
                .then(user => {
                    user.posts.unshift(post);
                    user.save();
                    // REDIRECT TO THE NEW POST
                    res.redirect(`/posts/${post._id}`);
                })
                .catch(err => {
                    console.log(err.message);
                });
        } else {
            return res.status(401); // UNAUTHORIZED
        }
    });

    // GET ONE
    app.get("/posts/:id", function(req, res) {
        // SHOW
        var currentUser = req.user;
        Post.findById(req.params.id).populate('comments').lean()
        //Post.findById(req.params.id).populate({path:'comments', populate: {path: 'author'}}).populate('author')
        //Post.findById(req.params.id).populate('comments')
        //.populate('author')
        .then((post) => {
            //post = post.toObject();
            res.render('posts_show', { post, currentUser })
        }).catch((err) => {
            console.log(err.message)
        });
    });

    // SUBREDDIT
    app.get("/n/:subreddit", function(req, res) {
        var currentUser = req.user;
        //Post.find({ subreddit: req.params.subreddit })
        //.populate('author')
        Post.find({ subreddit: req.params.subreddit }).lean()
        .then(posts => {
            // CONVERT ARRAY INTO OBJECTS
            //posts = posts.map(function(posts) { return posts.toObject(); });
            //console.log(posts)
            res.render("posts_index", { posts, currentUser });
        })
        .catch(err => {
            console.log(err);
        });
    });

    // VOTES
    app.put("/posts/:id/vote_up", function(req, res) {
        Post.findById(req.params.id).exec(function(err, post) {
        post.upVotes.push(req.user._id);
        post.voteScore = post.voteScore +1;
        post.save();

        res.status(200);
        });
    });

    app.put("/posts/:id/vote_down", function(req, res) {
        Post.findById(req.params.id).exec(function(err, post) {
        post.downVotes.push(req.user._id);
        post.voteScore = post.voteScore -1;
        post.save();

        res.status(200);
        });
    });
};
