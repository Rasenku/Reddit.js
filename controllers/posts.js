const Post = require('../models/post');




module.exports = app => {
  app.get("/posts/:id", function(req, res) {
  // LOOK UP THE POST
  Post.findById(req.params.id).populate('comments').then((post) => {
  res.render('post-show', { post })
}).catch((err) => {
  console.log(err.message)
})

});
  // CREATE
  app.post('/posts/new', (req, res) => {
    // INSTANTIATE INSTANCE OF POST MODEL
    const post = new Post(req.body);

    // SAVE INSTANCE OF POST MODEL TO DB
    post.save((err, post) => {
      // REDIRECT TO THE ROOT
      return res.redirect(`/`);
    })
  });


  // SUBREDDIT
  app.get("/n/:subreddit", function(req, res) {
    Post.find({ subreddit: req.params.subreddit })
      .then(posts => {
        res.render("posts-index", { posts });
      })
      .catch(err => {
        console.log(err);
      });
  });
};
